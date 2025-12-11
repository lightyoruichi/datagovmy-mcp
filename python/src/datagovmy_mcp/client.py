"""API client for Malaysian government data APIs."""

import httpx
from typing import Any, Optional


class DataGovMyClient:
    """Client for querying OpenDOSM and Data Catalogue APIs."""

    OPENDOSM_BASE_URL = "https://api.data.gov.my/opendosm"
    DATA_CATALOGUE_BASE_URL = "https://api.data.gov.my/data-catalogue"

    def __init__(self):
        """Initialize the API client."""
        self.client = httpx.AsyncClient(follow_redirects=True, timeout=30.0)

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

    async def query_opendosm(
        self,
        dataset_id: str,
        filters: Optional[dict[str, Any]] = None,
        limit: int = 100,
        offset: int = 0,
        meta_only: bool = False,
    ) -> list[dict[str, Any]] | dict[str, Any]:
        """Query an OpenDOSM dataset.

        Args:
            dataset_id: The dataset ID (e.g., 'cpi_core')
            filters: Optional filter parameters as key-value pairs
            limit: Maximum number of records to return
            offset: Number of records to skip
            meta_only: If True, return only metadata without data records

        Returns:
            List of data records or metadata dictionary

        Raises:
            httpx.HTTPError: If the API request fails
        """
        params: dict[str, Any] = {"id": dataset_id}

        if meta_only:
            params["meta_only"] = "true"
        else:
            params["limit"] = limit
            params["offset"] = offset

        if filters:
            params.update(filters)

        response = await self.client.get(self.OPENDOSM_BASE_URL, params=params)
        response.raise_for_status()

        return response.json()

    async def query_data_catalogue(
        self,
        dataset_id: str,
        filters: Optional[dict[str, Any]] = None,
        limit: int = 100,
        offset: int = 0,
        meta_only: bool = False,
    ) -> list[dict[str, Any]] | dict[str, Any]:
        """Query a Data Catalogue dataset.

        Args:
            dataset_id: The dataset ID (e.g., 'fuelprice')
            filters: Optional filter parameters as key-value pairs
            limit: Maximum number of records to return
            offset: Number of records to skip
            meta_only: If True, return only metadata without data records

        Returns:
            List of data records or metadata dictionary

        Raises:
            httpx.HTTPError: If the API request fails
        """
        params: dict[str, Any] = {"id": dataset_id}

        if meta_only:
            params["meta_only"] = "true"
        else:
            params["limit"] = limit
            params["offset"] = offset

        if filters:
            params.update(filters)

        response = await self.client.get(
            self.DATA_CATALOGUE_BASE_URL, params=params
        )
        response.raise_for_status()

        return response.json()
