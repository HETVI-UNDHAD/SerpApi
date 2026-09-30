import asyncio
import logging
import random
from typing import List, Optional
from urllib.parse import quote_plus

import httpx
from bs4 import BeautifulSoup

from app.schemas.omni_serp import SerpItem, SerpResponse

logger = logging.getLogger("ScraperService")

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0",
]


class AsyncMultiEngineScraper:
    def __init__(self, max_retries: int = 3, base_delay: float = 1.0, timeout: float = 10.0):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.timeout = timeout

    def _get_spoofed_headers(self) -> dict:
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
        }

    async def _fetch_with_backoff(self, client: httpx.AsyncClient, url: str) -> Optional[str]:
        for attempt in range(self.max_retries):
            try:
                headers = self._get_spoofed_headers()
                response = await client.get(url, headers=headers, timeout=self.timeout, follow_redirects=True)

                if response.status_code == 200:
                    return response.text
                elif response.status_code in (429, 503):
                    jitter = random.uniform(0.3, 1.2)
                    delay = (self.base_delay * (2 ** attempt)) + jitter
                    logger.warning(
                        f"HTTP {response.status_code} on {url}. Retrying in {delay:.2f}s "
                        f"(Attempt {attempt + 1}/{self.max_retries})..."
                    )
                    await asyncio.sleep(delay)
                else:
                    logger.warning(f"Unrecoverable HTTP status {response.status_code} for {url}")
                    return None
            except (httpx.RequestError, httpx.TimeoutException) as exc:
                delay = (self.base_delay * (2 ** attempt)) + random.uniform(0.2, 0.6)
                logger.warning(f"Network error on {url}: {exc}. Retrying in {delay:.2f}s...")
                await asyncio.sleep(delay)

        return None

    def _parse_google(self, html: str, query: str) -> List[SerpItem]:
        soup = BeautifulSoup(html, "html.parser")
        results = []
        for rank, block in enumerate(soup.select("div.g, div[data-hveid]"), start=1):
            title_elem = block.select_one("h3")
            link_elem = block.select_one("a[href]")
            snippet_elem = block.select_one("div.VwiC3b, div[style*='-webkit-line-clamp']")
            if title_elem and link_elem:
                href = link_elem.get("href", "")
                if href.startswith("http") and "google.com" not in href:
                    results.append(
                        SerpItem(
                            engine_name="Google",
                            query=query,
                            rank=rank,
                            title=title_elem.get_text(strip=True),
                            snippet=snippet_elem.get_text(strip=True) if snippet_elem else "",
                            link=href,
                        )
                    )
            if len(results) >= 10:
                break
        return results

    def _parse_bing(self, html: str, query: str) -> List[SerpItem]:
        soup = BeautifulSoup(html, "html.parser")
        results = []
        for rank, block in enumerate(soup.select("li.b_algo"), start=1):
            title_elem = block.select_one("h2 a")
            snippet_elem = block.select_one("div.b_caption p, p")
            if title_elem and title_elem.has_attr("href"):
                results.append(
                    SerpItem(
                        engine_name="Bing",
                        query=query,
                        rank=rank,
                        title=title_elem.get_text(strip=True),
                        snippet=snippet_elem.get_text(strip=True) if snippet_elem else "",
                        link=title_elem["href"],
                    )
                )
            if len(results) >= 10:
                break
        return results

    def _parse_brave(self, html: str, query: str) -> List[SerpItem]:
        soup = BeautifulSoup(html, "html.parser")
        results = []
        for rank, block in enumerate(soup.select("div.snippet, div[data-type='web']"), start=1):
            title_elem = block.select_one("span.snippet-title, a.heading, .title")
            link_elem = block.select_one("a[href]")
            snippet_elem = block.select_one("div.snippet-description, p.snippet-description, .snippet-content")
            if title_elem and link_elem:
                href = link_elem.get("href", "")
                if href.startswith("http"):
                    results.append(
                        SerpItem(
                            engine_name="Brave",
                            query=query,
                            rank=rank,
                            title=title_elem.get_text(strip=True),
                            snippet=snippet_elem.get_text(strip=True) if snippet_elem else "",
                            link=href,
                        )
                    )
            if len(results) >= 10:
                break
        return results

    async def _fetch_engine(self, client: httpx.AsyncClient, engine: str, query: str) -> List[SerpItem]:
        encoded_query = quote_plus(query)
        endpoints = {
            "Google": f"https://www.google.com/search?q={encoded_query}&num=10&hl=en",
            "Bing": f"https://www.bing.com/search?q={encoded_query}&count=10&setlang=en-US",
            "Brave": f"https://search.brave.com/search?q={encoded_query}&source=web",
        }
        url = endpoints[engine]
        html = await self._fetch_with_backoff(client, url)
        if not html:
            return []

        if engine == "Google":
            return self._parse_google(html, query)
        elif engine == "Bing":
            return self._parse_bing(html, query)
        elif engine == "Brave":
            return self._parse_brave(html, query)
        return []

    async def search_all(self, query: str) -> SerpResponse:
        limits = httpx.Limits(max_keepalive_connections=15, max_connections=30)
        async with httpx.AsyncClient(limits=limits, http2=True) as client:
            tasks = [
                self._fetch_engine(client, "Google", query),
                self._fetch_engine(client, "Bing", query),
                self._fetch_engine(client, "Brave", query),
            ]
            engine_results = await asyncio.gather(*tasks, return_exceptions=True)

        merged_items: List[SerpItem] = []
        for result in engine_results:
            if isinstance(result, list):
                merged_items.extend(result)
            elif isinstance(result, Exception):
                logger.error(f"Engine scraping raised error: {result}")

        return SerpResponse(query=query, total_results=len(merged_items), items=merged_items)


scraper_service = AsyncMultiEngineScraper()
