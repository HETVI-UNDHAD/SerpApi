import asyncio
import logging
from typing import Optional

from app.config import LLM_API_KEY
from app.schemas.omni_serp import QueryExpansionOutput

logger = logging.getLogger("IntentService")

try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except ImportError:
    _GENAI_AVAILABLE = False


class QueryIntentExpander:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or LLM_API_KEY
        self.model = None
        if _GENAI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    generation_config={"response_mime_type": "application/json"}
                )
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini intent model: {e}")

    async def expand_query(self, raw_query: str) -> QueryExpansionOutput:
        q = raw_query.strip()
        prompt = f"""
        Act as an expert search engine query optimizer.
        Analyze this raw query: "{q}"
        
        Generate exactly 3 optimized sub-queries targeting:
        1. Architecture / Official documentation
        2. Real-world benchmarks / technical tradeoffs
        3. Practical implementation & comparisons
        
        Classify the primary intent. Return valid JSON adhering to schema:
        {{
            "original_query": "{q}",
            "expanded_queries": ["query 1", "query 2", "query 3"],
            "primary_intent": "technical comparison"
        }}
        """

        if self.model:
            try:
                response = await asyncio.to_thread(self.model.generate_content, prompt)
                return QueryExpansionOutput.model_validate_json(response.text)
            except Exception as e:
                logger.warning(f"LLM query expansion fallback due to: {e}")

        # Deterministic heuristic intent categorization
        q_lower = q.lower()
        if any(w in q_lower for w in ["vs", "compare", "difference", "best", "versus"]):
            intent = "technical comparison"
        elif any(w in q_lower for w in ["benchmark", "speed", "latency", "throughput", "fps", "performance"]):
            intent = "benchmark & performance"
        elif any(w in q_lower for w in ["fix", "error", "issue", "bug", "crash", "failed"]):
            intent = "troubleshooting"
        elif any(w in q_lower for w in ["buy", "pricing", "cost", "download", "login", "official"]):
            intent = "commercial/navigational"
        else:
            intent = "informational"

        return QueryExpansionOutput(
            original_query=q,
            expanded_queries=[
                f"{q} official documentation architecture",
                f"{q} benchmarks performance metrics",
                f"{q} production tradeoffs comparison vs alternatives"
            ],
            primary_intent=intent
        )


intent_service = QueryIntentExpander()
