from datetime import datetime, timezone
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class SerpItem(BaseModel):
    engine_name: str
    query: str
    rank: int
    title: str
    snippet: str
    link: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SerpResponse(BaseModel):
    query: str
    total_results: int
    items: List[SerpItem]


class QueryExpansionOutput(BaseModel):
    original_query: str
    expanded_queries: List[str] = Field(
        ...,
        description="3 distinct, high-intent query variations (benchmarks, docs, real-world comparison)."
    )
    primary_intent: Literal[
        "technical comparison",
        "troubleshooting",
        "informational",
        "commercial/navigational",
        "benchmark & performance"
    ] = Field(..., description="High-level search intent classification")


class SourceRef(BaseModel):
    index: int
    title: str
    url: str
    engines: List[str]
    confidence_score: float


class SynthesisReport(BaseModel):
    synthesized_answer: str
    divergence_notes: str
    consensus_score: float
    sources: List[SourceRef]


class OmniSearchRequest(BaseModel):
    query: str
    expand_intent: bool = True
    use_cache: bool = True


class OmniSearchResponse(BaseModel):
    query: str
    intent: str
    cache_status: str
    consensus_score: float
    synthesized_answer: str
    divergence_notes: str
    sources: List[SourceRef]
    raw_serp_count: int
