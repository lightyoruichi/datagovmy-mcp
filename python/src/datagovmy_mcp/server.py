"""MCP server for Malaysian government data APIs."""

import json
import os
from typing import Any, Optional
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from dataclasses import dataclass

from mcp.server.fastmcp import FastMCP, Context
from mcp.server.session import ServerSession

from .client import DataGovMyClient


# Load datasets index
DATASETS_PATH = os.path.join(os.path.dirname(__file__), "datasets.json")
with open(DATASETS_PATH, "r", encoding="utf-8") as f:
    DATASETS_INDEX = json.load(f)


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


@mcp.tool()
async def list_datasets(
    source: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> str:
    """List available datasets from the catalogues.

    Args:
        source: Filter by data source - 'opendosm', 'data_catalogue', or None for all
        category: Filter by category (e.g., 'Prices', 'Demography', 'Economy')
        limit: Maximum number of datasets to return (default: 100)
        offset: Number of datasets to skip for pagination (default: 0)

    Returns:
        JSON string containing list of datasets with metadata

    Examples:
        - List all datasets: (no parameters)
        - List OpenDOSM datasets: source='opendosm'
        - List price-related datasets: category='Prices'
    """
    datasets = []
    
    # Collect datasets from specified sources
    if source is None or source == "opendosm":
        datasets.extend([{**d, "source": "opendosm"} for d in DATASETS_INDEX["opendosm"]])
    if source is None or source == "data_catalogue":
        datasets.extend([{**d, "source": "data_catalogue"} for d in DATASETS_INDEX["data_catalogue"]])
    
    # Filter by category if specified
    if category:
        datasets = [d for d in datasets if d.get("category", "").lower() == category.lower()]
    
    # Apply pagination
    total = len(datasets)
    datasets = datasets[offset:offset + limit]
    
    result = {
        "total": total,
        "limit": limit,
        "offset": offset,
        "count": len(datasets),
        "datasets": datasets
    }
    
    return json.dumps(result, indent=2, ensure_ascii=False)


@mcp.tool()
async def search_datasets(
    query: str,
    source: Optional[str] = None,
    limit: int = 10,
) -> str:
    """Search for datasets by keyword.

    Args:
        query: Search query (searches in name, description, keywords, and ID)
        source: Filter by data source - 'opendosm', 'data_catalogue', or None for all
        limit: Maximum number of results to return (default: 10)

    Returns:
        JSON string containing matching datasets ranked by relevance

    Examples:
        - Search for fuel data: query='fuel'
        - Search for GDP: query='gdp'
        - Search for population: query='population'
    """
    query_lower = query.lower()
    datasets = []
    
    # Collect datasets from specified sources
    if source is None or source == "opendosm":
        datasets.extend([{**d, "source": "opendosm"} for d in DATASETS_INDEX["opendosm"]])
    if source is None or source == "data_catalogue":
        datasets.extend([{**d, "source": "data_catalogue"} for d in DATASETS_INDEX["data_catalogue"]])
    
    # Search and rank results
    scored_datasets = []
    for dataset in datasets:
        score = 0
        
        # Exact ID match gets highest score
        if query_lower == dataset["id"].lower():
            score += 100
        elif query_lower in dataset["id"].lower():
            score += 50
            
        # Name matching
        if query_lower in dataset["name"].lower():
            score += 30
            
        # Description matching
        if query_lower in dataset["description"].lower():
            score += 10
            
        # Keyword matching
        for keyword in dataset.get("keywords", []):
            if query_lower == keyword.lower():
                score += 40
            elif query_lower in keyword.lower():
                score += 20
        
        if score > 0:
            scored_datasets.append((score, dataset))
    
    # Sort by score (descending) and apply limit
    scored_datasets.sort(key=lambda x: x[0], reverse=True)
    results = [dataset for _, dataset in scored_datasets[:limit]]
    
    result = {
        "query": query,
        "count": len(results),
        "datasets": results
    }
    
    return json.dumps(result, indent=2, ensure_ascii=False)


@mcp.tool()
async def get_dataset_schema(
    dataset_id: str,
    source: str,
    ctx: Context[ServerSession, AppContext],
) -> str:
    """Get schema and sample data for a dataset.

    Args:
        dataset_id: The dataset ID to get schema for
        source: The data source - either 'opendosm' or 'data_catalogue'

    Returns:
        JSON string containing dataset metadata, schema, and sample records

    Examples:
        - Get fuel price schema: dataset_id='fuelprice', source='data_catalogue'
        - Get GDP schema: dataset_id='gdp', source='opendosm'
    """
    client = ctx.request_context.lifespan_context.api_client
    
    try:
        # Get dataset info from index
        dataset_info = None
        source_key = "opendosm" if source == "opendosm" else "data_catalogue"
        
        for ds in DATASETS_INDEX.get(source_key, []):
            if ds["id"] == dataset_id:
                dataset_info = ds
                break
        
        # Get metadata from API
        if source == "opendosm":
            metadata = await client.query_opendosm(
                dataset_id=dataset_id, meta_only=True
            )
        elif source == "data_catalogue":
            metadata = await client.query_data_catalogue(
                dataset_id=dataset_id, meta_only=True
            )
        else:
            return json.dumps(
                {"error": "Invalid source. Must be 'opendosm' or 'data_catalogue'"},
                indent=2,
            )
        
        # Get sample data
        if source == "opendosm":
            sample_data = await client.query_opendosm(
                dataset_id=dataset_id, limit=3
            )
        else:
            sample_data = await client.query_data_catalogue(
                dataset_id=dataset_id, limit=3
            )
        
        result = {
            "dataset_id": dataset_id,
            "source": source,
            "info": dataset_info or {"id": dataset_id, "name": "Unknown"},
            "metadata": metadata,
            "sample_data": sample_data
        }
        
        return json.dumps(result, indent=2, ensure_ascii=False)
        
    except Exception as e:
        return json.dumps(
            {"error": str(e), "dataset_id": dataset_id, "source": source},
            indent=2,
        )


@mcp.resource("dataset://opendosm/all")
async def list_opendosm_datasets() -> str:
    """List all OpenDOSM datasets as an MCP resource."""
    datasets = [
        f"- **{d['id']}**: {d['name']} - {d['description']}"
        for d in DATASETS_INDEX["opendosm"]
    ]
    return "# OpenDOSM Datasets\n\n" + "\n".join(datasets)


@mcp.resource("dataset://data-catalogue/all")
async def list_data_catalogue_datasets() -> str:
    """List all Data Catalogue datasets as an MCP resource."""
    datasets = [
        f"- **{d['id']}**: {d['name']} - {d['description']}"
        for d in DATASETS_INDEX["data_catalogue"]
    ]
    return "# Data Catalogue Datasets\n\n" + "\n".join(datasets)


@mcp.resource("dataset://popular")
async def list_popular_datasets() -> str:
    """List popular datasets from both sources."""
    popular = []
    
    # Get first 10 from each source
    for d in DATASETS_INDEX["opendosm"][:10]:
        popular.append(f"- **{d['id']}** (OpenDOSM): {d['name']}")
    
    for d in DATASETS_INDEX["data_catalogue"][:10]:
        popular.append(f"- **{d['id']}** (Data Catalogue): {d['name']}")
    
    return "# Popular Datasets\n\n" + "\n".join(popular)


def main():
    """Run the MCP server."""
    mcp.run()


if __name__ == "__main__":
    main()
