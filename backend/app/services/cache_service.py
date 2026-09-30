import json
import logging
import os
from typing import Dict, Optional, Tuple
import numpy as np

logger = logging.getLogger("CacheService")

try:
    import redis.asyncio as aioredis
    _REDIS_AVAILABLE = True
except ImportError:
    _REDIS_AVAILABLE = False

try:
    from sentence_transformers import SentenceTransformer
    _TRANSFORMERS_AVAILABLE = True
except ImportError:
    _TRANSFORMERS_AVAILABLE = False


class SemanticRedisCache:
    def __init__(
        self,
        redis_url: Optional[str] = None,
        similarity_threshold: float = 0.92,
        ttl_seconds: int = 86400,
    ):
        self.redis_url = redis_url or os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.similarity_threshold = similarity_threshold
        self.ttl = ttl_seconds
        self.redis = None
        self._connected = False
        self._in_memory_exact: Dict[str, dict] = {}
        self._in_memory_vectors: Dict[str, np.ndarray] = {}

        self.encoder = None
        if _TRANSFORMERS_AVAILABLE:
            try:
                self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
            except Exception as e:
                logger.warning(f"Could not load SentenceTransformer: {e}")

    async def connect(self):
        if self._connected:
            return
        if _REDIS_AVAILABLE:
            try:
                self.redis = await aioredis.from_url(
                    self.redis_url,
                    socket_connect_timeout=2.0,
                    decode_responses=False
                )
                await self.redis.ping()
                self._connected = True
                logger.info("[CACHE] Connected to Redis instance.")
                return
            except Exception as e:
                logger.info(f"[CACHE] Redis not reachable ({e}). Using in-memory fallback cache.")
        self._connected = True

    def _embed(self, text: str) -> Optional[np.ndarray]:
        if self.encoder:
            try:
                vec = self.encoder.encode(text, normalize_embeddings=True)
                return vec.astype(np.float32)
            except Exception:
                pass
        # Deterministic pseudo-vector fallback if sentence_transformers not installed
        words = text.lower().split()
        vec = np.zeros(64, dtype=np.float32)
        for w in words:
            idx = abs(hash(w)) % 64
            vec[idx] += 1.0
        norm = np.linalg.norm(vec)
        return vec / norm if norm > 0 else vec

    async def get(self, query: str) -> Tuple[Optional[dict], Optional[str]]:
        await self.connect()
        clean_q = query.strip().lower()

        # 1. Exact match (24h TTL)
        if self.redis:
            try:
                hit = await self.redis.get(f"exact:{clean_q}")
                if hit:
                    return json.loads(hit.decode("utf-8")), "EXACT_CACHE"
            except Exception:
                pass
        elif clean_q in self._in_memory_exact:
            return self._in_memory_exact[clean_q], "EXACT_CACHE"

        # 2. Semantic vector match (cosine similarity >= threshold)
        target_vec = self._embed(clean_q)
        if target_vec is None:
            return None, None

        if self.redis:
            try:
                keys = await self.redis.keys("vec:*")
                best_sim = -1.0
                best_payload_key = None
                for k in keys:
                    raw_vec = await self.redis.get(k)
                    if not raw_vec:
                        continue
                    cached_vec = np.frombuffer(raw_vec, dtype=np.float32)
                    sim = float(np.dot(target_vec, cached_vec))
                    if sim > best_sim:
                        best_sim = sim
                        best_payload_key = k.decode("utf-8").replace("vec:", "payload:")

                if best_sim >= self.similarity_threshold and best_payload_key:
                    raw_payload = await self.redis.get(best_payload_key)
                    if raw_payload:
                        return json.loads(raw_payload.decode("utf-8")), f"SEMANTIC_CACHE (sim: {best_sim:.3f})"
            except Exception as e:
                logger.warning(f"Redis vector lookup error: {e}")
        else:
            best_sim = -1.0
            best_key = None
            for k, cached_vec in self._in_memory_vectors.items():
                sim = float(np.dot(target_vec, cached_vec))
                if sim > best_sim:
                    best_sim = sim
                    best_key = k

            if best_sim >= self.similarity_threshold and best_key:
                return self._in_memory_exact.get(best_key), f"SEMANTIC_CACHE (sim: {best_sim:.3f})"

        return None, None

    async def set(self, query: str, payload: dict):
        await self.connect()
        clean_q = query.strip().lower()
        target_vec = self._embed(clean_q)

        if self.redis:
            try:
                json_bytes = json.dumps(payload).encode("utf-8")
                pipe = self.redis.pipeline()
                pipe.setex(f"exact:{clean_q}", self.ttl, json_bytes)
                pipe.setex(f"payload:{clean_q}", self.ttl, json_bytes)
                if target_vec is not None:
                    pipe.setex(f"vec:{clean_q}", self.ttl, target_vec.tobytes())
                await pipe.execute()
                return
            except Exception as e:
                logger.warning(f"Redis set failed ({e}). Falling back to memory.")

        # In-memory fallback
        self._in_memory_exact[clean_q] = payload
        if target_vec is not None:
            self._in_memory_vectors[clean_q] = target_vec


cache_service = SemanticRedisCache()
