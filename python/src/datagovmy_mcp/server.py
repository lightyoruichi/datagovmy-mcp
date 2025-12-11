"""MCP server for Malaysian government data APIs."""

import json
from typing import Any, Optional
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from dataclasses import dataclass

from mcp.server.fastmcp import FastMCP, Context
from mcp.server.session import ServerSession

from .client import DataGovMyClient


@dataclass
class AppContext:
    """Application context with API client."""

    api_client: DataGovMyClient


@asynccontextmanager
async def app_lifespan(server: FastMCP) -> AsyncIterator[AppContext]:
    """Manage application lifecycle with API client."""
    client = DataGovMyClient()
    try:
        yield AppContext(api_client=client)
    finally:
        await client.close()


# Create MCP server
mcp = FastMCP("Malaysia Data Government", lifespan=app_lifespan)


@mcp.tool()
async def query_opendosm(
    dataset_id: str,
    ctx: Context[ServerSession, AppContext],
    filters: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> str:
    """Query an OpenDOSM dataset.

    Args:
        dataset_id: The dataset ID to query (e.g., 'cpi_core', 'gdp', 'population')
        filters: Optional JSON string of filter parameters (e.g., '{"date": "2024-01-01"}')
        limit: Maximum number of records to return (default: 100)
        offset: Number of records to skip for pagination (default: 0)

    Returns:
        JSON string containing the queried data records

    Examples:
        - Get latest CPI data: dataset_id='cpi_core', limit=10
        - Get GDP data for specific date: dataset_id='gdp', filters='{"date": "2024-01-01"}'
    """
    client = ctx.request_context.lifespan_context.api_client

    # Parse filters if provided
    filter_dict = json.loads(filters) if filters else None

    try:
        data = await client.query_opendosm(
            dataset_id=dataset_id,
            filters=filter_dict,
            limit=limit,
            offset=offset,
        )
        return json.dumps(data, indent=2, ensure_ascii=False)
    except Exception as e:
        return json.dumps(
            {"error": str(e), "dataset_id": dataset_id}, indent=2
        )


@mcp.tool()
async def query_data_catalogue(
    dataset_id: str,
    ctx: Context[ServerSession, AppContext],
    filters: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> str:
    """Query a Data Catalogue dataset.

    Args:
        dataset_id: The dataset ID to query (e.g., 'fuelprice', 'healthcare', 'crime')
        filters: Optional JSON string of filter parameters (e.g., '{"date": "2024-01-01"}')
        limit: Maximum number of records to return (default: 100)
        offset: Number of records to skip for pagination (default: 0)

    Returns:
        JSON string containing the queried data records

    Examples:
        - Get latest fuel prices: dataset_id='fuelprice', limit=5
        - Get filtered data: dataset_id='fuelprice', filters='{"date": "2024-12-01"}'
    """
    client = ctx.request_context.lifespan_context.api_client

    # Parse filters if provided
    filter_dict = json.loads(filters) if filters else None

    try:
        data = await client.query_data_catalogue(
            dataset_id=dataset_id,
            filters=filter_dict,
            limit=limit,
            offset=offset,
        )
        return json.dumps(data, indent=2, ensure_ascii=False)
    except Exception as e:
        return json.dumps(
            {"error": str(e), "dataset_id": dataset_id}, indent=2
        )


@mcp.tool()
async def get_dataset_metadata(
    dataset_id: str,
    source: str,
    ctx: Context[ServerSession, AppContext],
) -> str:
    """Get metadata for a dataset without fetching the actual data records.

    Args:
        dataset_id: The dataset ID to get metadata for
        source: The data source - either 'opendosm' or 'data_catalogue'

    Returns:
        JSON string containing dataset metadata (columns, types, descriptions)

    Examples:
        - Get fuel price metadata: dataset_id='fuelprice', source='data_catalogue'
        - Get CPI metadata: dataset_id='cpi_core', source='opendosm'
    """
    client = ctx.request_context.lifespan_context.api_client

    try:
        if source == "opendosm":
            data = await client.query_opendosm(
                dataset_id=dataset_id, meta_only=True
            )
        elif source == "data_catalogue":
            data = await client.query_data_catalogue(
                dataset_id=dataset_id, meta_only=True
            )
        else:
            return json.dumps(
                {
                    "error": "Invalid source. Must be 'opendosm' or 'data_catalogue'"
                },
                indent=2,
            )

        return json.dumps(data, indent=2, ensure_ascii=False)
    except Exception as e:
        return json.dumps(
            {"error": str(e), "dataset_id": dataset_id, "source": source},
            indent=2,
        )


def main():
    """Run the MCP server."""
    mcp.run()


if __name__ == "__main__":
    main()
