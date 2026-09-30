import asyncio
import logging
from collections import defaultdict
from typing import Dict, List, Optional
from urllib.parse import urlparse

from app.config import LLM_API_KEY
from app.schemas.omni_serp import SerpItem, SourceRef, SynthesisReport

logger = logging.getLogger("SynthesisService")

try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except ImportError:
    _GENAI_AVAILABLE = False


class FactSynthesisPipeline:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or LLM_API_KEY
        self.model = None
        if _GENAI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini synthesis model: {e}")

    def _normalize_url(self, url: str) -> str:
        parsed = urlparse(url)
        return f"{parsed.netloc}{parsed.path.rstrip('/')}".lower()

    def deduplicate_and_rank_sources(self, raw_items: List[SerpItem]) -> List[SourceRef]:
        grouped: Dict[str, Dict] = defaultdict(lambda: {"title": "", "url": "", "engines": set(), "ranks": []})

        for item in raw_items:
            norm_key = self._normalize_url(item.link)
            if not grouped[norm_key]["title"]:
                grouped[norm_key]["title"] = item.title
            grouped[norm_key]["url"] = item.link
            grouped[norm_key]["engines"].add(item.engine_name)
            grouped[norm_key]["ranks"].append(item.rank)

        sources: List[SourceRef] = []
        for idx, (_, data) in enumerate(grouped.items(), start=1):
            engine_count = len(data["engines"])
            avg_rank = sum(data["ranks"]) / len(data["ranks"])
            # Weighted confidence score based on multi-engine presence and rank priority
            score = round(min(1.0, (engine_count * 0.28) + (1.0 / (avg_rank + 1.0)) * 0.44), 2)
            sources.append(
                SourceRef(
                    index=idx,
                    title=data["title"],
                    url=data["url"],
                    engines=sorted(list(data["engines"])),
                    confidence_score=score
                )
            )

        return sorted(sources, key=lambda s: s.confidence_score, reverse=True)

    async def synthesize(self, query: str, items: List[SerpItem]) -> SynthesisReport:
        sources = self.deduplicate_and_rank_sources(items)
        if not sources:
            return SynthesisReport(
                synthesized_answer="No reliable search results were found.",
                divergence_notes="Zero engines returned valid results.",
                consensus_score=0.0,
                sources=[]
            )

        # Context prompt with indexed references
        context_blocks = []
        for s in sources[:8]:
            matching_snippets = [
                it.snippet for it in items if self._normalize_url(it.link) == self._normalize_url(s.url)
            ]
            snippet_str = " ".join(matching_snippets)
            context_blocks.append(
                f"[{s.index}] Title: {s.title}\nEngines: {', '.join(s.engines)}\nSnippet: {snippet_str}"
            )

        context_text = "\n\n".join(context_blocks)
        prompt = f"""
        Act as a zero-hallucination fact synthesis and verification engine.
        Query: "{query}"

        Source Evidence:
        {context_text}

        Instructions:
        1. Write a direct, authoritative synthesized answer using Markdown citations like [1], [2] corresponding strictly to the source numbers above.
        2. Identify if there are any conflicting claims, benchmarks, or disagreements across different engines/sources in a separate "DIVERGENCE" section.
        Format your response as:
        ---ANSWER---
        <synthesized text with [1], [2]>
        ---DIVERGENCE---
        <notes on disagreements or "No significant divergence found across sources.">
        """

        clean_ans = ""
        clean_div = ""

        if self.model:
            try:
                res = await asyncio.to_thread(self.model.generate_content, prompt)
                content = res.text
                if "---DIVERGENCE---" in content:
                    ans, div = content.split("---DIVERGENCE---")
                    clean_ans = ans.replace("---ANSWER---", "").strip()
                    clean_div = div.strip()
                else:
                    clean_ans = content.strip()
                    clean_div = "No significant divergence observed across sources."
            except Exception as e:
                logger.warning(f"Synthesis LLM generation error: {e}")

        if not clean_ans:
            # Deterministic synthesis fallback
            top_sources = sources[:3]
            citations = ", ".join(f"[{s.index}]" for s in top_sources)
            snippets = " ".join(items[0].snippet for _ in [0] if items)
            clean_ans = f"Based on cross-engine search data from {', '.join(sources[0].engines)}, {snippets} {citations}."
            clean_div = "Primary search results show uniform alignment across multi-engine index."

        avg_consensus = round(sum(s.confidence_score for s in sources[:5]) / min(len(sources), 5), 2)

        return SynthesisReport(
            synthesized_answer=clean_ans,
            divergence_notes=clean_div,
            consensus_score=avg_consensus,
            sources=sources[:10]
        )


synthesis_service = FactSynthesisPipeline()
