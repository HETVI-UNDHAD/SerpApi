import asyncio
import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException

from app.schemas.omni_serp import (
    OmniSearchRequest,
    OmniSearchResponse,
    QueryExpansionOutput,
    SerpResponse,
    SynthesisReport,
)
from app.services.cache_service import cache_service
from app.services.intent_service import intent_service
from app.services.scraper_service import scraper_service
from app.services.synthesis_service import synthesis_service

logger = logging.getLogger("OmniSerpRoute")

router = APIRouter(tags=["OmniSERP AI"])


@router.post("/omni-search", response_model=OmniSearchResponse)
@router.post("/search", response_model=OmniSearchResponse)
async def omni_search(request: OmniSearchRequest, background_tasks: BackgroundTasks):
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # 1. Fast Redis / Semantic Cache Check
    if request.use_cache:
        cached_result, cache_tag = await cache_service.get(query)
        if cached_result:
            return OmniSearchResponse(
                query=query,
                intent=cached_result.get("intent", "informational"),
                cache_status=cache_tag or "CACHE_HIT",
                consensus_score=cached_result.get("consensus_score", 1.0),
                synthesized_answer=cached_result.get("synthesized_answer", ""),
                divergence_notes=cached_result.get("divergence_notes", ""),
                sources=cached_result.get("sources", []),
                raw_serp_count=cached_result.get("raw_serp_count", 0),
            )

    # 2. Query Disambiguation & Intent Expansion
    intent_output: QueryExpansionOutput = await intent_service.expand_query(query)

    # 3. High-Throughput Concurrent Scraper (Google, Bing, Brave)
    # Search the primary query plus variations if requested
    queries_to_scrape = [query]
    if request.expand_intent and intent_output.expanded_queries:
        queries_to_scrape.append(intent_output.expanded_queries[0])

    scrape_tasks = [scraper_service.search_all(q) for q in queries_to_scrape]
    serp_responses = await asyncio.gather(*scrape_tasks, return_exceptions=True)

    all_items = []
    for resp in serp_responses:
        if isinstance(resp, SerpResponse):
            all_items.extend(resp.items)

    # 4. Fact Synthesis, Citation & Source Divergence Engine
    synthesis_report: SynthesisReport = await synthesis_service.synthesize(query, all_items)

    response_payload = {
        "query": query,
        "intent": intent_output.primary_intent,
        "cache_status": "CACHE_MISS (FRESH_FETCH)",
        "consensus_score": synthesis_report.consensus_score,
        "synthesized_answer": synthesis_report.synthesized_answer,
        "divergence_notes": synthesis_report.divergence_notes,
        "sources": [s.model_dump() for s in synthesis_report.sources],
        "raw_serp_count": len(all_items),
    }

    # 5. Background Cache Storage
    background_tasks.add_task(cache_service.set, query, response_payload)

    return OmniSearchResponse(**response_payload)
