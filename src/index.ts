#!/usr/bin/env node
/**
 * MCP server for Malaysian government data APIs (OpenDOSM and Data Catalogue).
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DataGovMyClient } from "./client.js";
import datasetsIndex from "./datasets.json" with { type: "json" };

// Type for dataset index
interface Dataset {
    id: string;
    name: string;
    description: string;
    category?: string;
    keywords?: string[];
}

interface DatasetsIndex {
    opendosm: Dataset[];
    data_catalogue: Dataset[];
}

// Tool argument types
interface QueryToolArgs {
    dataset_id: string;
    filters?: string;
    limit?: number;
    offset?: number;
}

interface MetadataToolArgs {
    dataset_id: string;
    source: "opendosm" | "data_catalogue";
}

interface ListDatasetsArgs {
    source?: "opendosm" | "data_catalogue";
    category?: string;
    limit?: number;
    offset?: number;
}

interface SearchDatasetsArgs {
    query: string;
    source?: "opendosm" | "data_catalogue";
    limit?: number;
}

const DATASETS_INDEX = datasetsIndex as DatasetsIndex;

// Create server and client
const server = new Server(
    {
        name: "Malaysia Data Government",
        version: "0.3.0",
    },
    {
        capabilities: {
            tools: {},
            resources: {},
        },
    }
);

const apiClient = new DataGovMyClient();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, () => {
    return {
        tools: [
            {
                name: "query_opendosm",
                description:
                    "Query an OpenDOSM dataset (Department of Statistics Malaysia)",
                inputSchema: {
                    type: "object",
                    properties: {
                        dataset_id: {
                            type: "string",
                            description:
                                "Dataset ID (e.g., 'cpi_core', 'gdp', 'population')",
                        },
                        filters: {
                            type: "string",
                            description:
                                'Optional JSON string of filter parameters (e.g., \'{"date": "2024-01-01"}\')',
                        },
                        limit: {
                            type: "number",
                            description: "Maximum number of records to return (default: 100)",
                            default: 100,
                        },
                        offset: {
                            type: "number",
                            description:
                                "Number of records to skip for pagination (default: 0)",
                            default: 0,
                        },
                    },
                    required: ["dataset_id"],
                },
            },
            {
                name: "query_data_catalogue",
                description: "Query a Data Catalogue dataset (broader government data)",
                inputSchema: {
                    type: "object",
                    properties: {
                        dataset_id: {
                            type: "string",
                            description:
                                "Dataset ID (e.g., 'fuelprice', 'healthcare', 'crime')",
                        },
                        filters: {
                            type: "string",
                            description:
                                'Optional JSON string of filter parameters (e.g., \'{"date": "2024-01-01"}\')',
                        },
                        limit: {
                            type: "number",
                            description: "Maximum number of records to return (default: 100)",
                            default: 100,
                        },
                        offset: {
                            type: "number",
                            description:
                                "Number of records to skip for pagination (default: 0)",
                            default: 0,
                        },
                    },
                    required: ["dataset_id"],
                },
            },
            {
                name: "get_dataset_metadata",
                description:
                    "Get metadata for a dataset without fetching the actual data records",
                inputSchema: {
                    type: "object",
                    properties: {
                        dataset_id: {
                            type: "string",
                            description: "Dataset ID to get metadata for",
                        },
                        source: {
                            type: "string",
                            description:
                                "Data source - either 'opendosm' or 'data_catalogue'",
                            enum: ["opendosm", "data_catalogue"],
                        },
                    },
                    required: ["dataset_id", "source"],
                },
            },
            {
                name: "list_datasets",
                description: "List all available datasets with optional filtering",
                inputSchema: {
                    type: "object",
                    properties: {
                        source: {
                            type: "string",
                            description:
                                "Filter by source - 'opendosm', 'data_catalogue', or omit for all",
                            enum: ["opendosm", "data_catalogue"],
                        },
                        category: {
                            type: "string",
                            description:
                                "Filter by category (e.g., 'Prices', 'Demography', 'Economy')",
                        },
                        limit: {
                            type: "number",
                            description: "Maximum number of datasets to return (default: 100)",
                            default: 100,
                        },
                        offset: {
                            type: "number",
                            description:
                                "Number of datasets to skip for pagination (default: 0)",
                            default: 0,
                        },
                    },
                },
            },
            {
                name: "search_datasets",
                description: "Search for datasets by keyword",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description:
                                "Search query (searches in name, description, keywords, and ID)",
                        },
                        source: {
                            type: "string",
                            description:
                                "Filter by source - 'opendosm', 'data_catalogue', or omit for all",
                            enum: ["opendosm", "data_catalogue"],
                        },
                        limit: {
                            type: "number",
                            description: "Maximum number of results to return (default: 10)",
                            default: 10,
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "get_dataset_schema",
                description: "Get schema, metadata, and sample data for a dataset",
                inputSchema: {
                    type: "object",
                    properties: {
                        dataset_id: {
                            type: "string",
                            description: "Dataset ID to get schema for",
                        },
                        source: {
                            type: "string",
                            description:
                                "Data source - either 'opendosm' or 'data_catalogue'",
                            enum: ["opendosm", "data_catalogue"],
                        },
                    },
                    required: ["dataset_id", "source"],
                },
            },
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "query_opendosm": {
                const { dataset_id, filters, limit = 100, offset = 0 } = args as unknown as QueryToolArgs;
                const filterDict = filters ? JSON.parse(filters) as Record<string, unknown> : undefined;

                const data = await apiClient.queryOpenDOSM(dataset_id, {
                    filters: filterDict,
                    limit,
                    offset,
                });

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            }

            case "query_data_catalogue": {
                const { dataset_id, filters, limit = 100, offset = 0 } = args as unknown as QueryToolArgs;
                const filterDict = filters ? JSON.parse(filters) as Record<string, unknown> : undefined;

                const data = await apiClient.queryDataCatalogue(dataset_id, {
                    filters: filterDict,
                    limit,
                    offset,
                });

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            }

            case "get_dataset_metadata": {
                const { dataset_id, source } = args as unknown as MetadataToolArgs;

                let data;
                if (source === "opendosm") {
                    data = await apiClient.queryOpenDOSM(dataset_id, { metaOnly: true });
                } else if (source === "data_catalogue") {
                    data = await apiClient.queryDataCatalogue(dataset_id, {
                        metaOnly: true,
                    });
                } else {
                    throw new Error(
                        "Invalid source. Must be 'opendosm' or 'data_catalogue'"
                    );
                }

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            }

            case "list_datasets": {
                const { source, category, limit = 100, offset = 0 } = args as unknown as ListDatasetsArgs;

                let datasets: Array<Dataset & { source: string }> = [];

                // Collect datasets from specified sources
                if (!source || source === "opendosm") {
                    datasets.push(
                        ...DATASETS_INDEX.opendosm.map((d) => ({ ...d, source: "opendosm" }))
                    );
                }
                if (!source || source === "data_catalogue") {
                    datasets.push(
                        ...DATASETS_INDEX.data_catalogue.map((d) => ({
                            ...d,
                            source: "data_catalogue",
                        }))
                    );
                }

                // Filter by category if specified
                if (category) {
                    datasets = datasets.filter(
                        (d) => d.category?.toLowerCase() === category.toLowerCase()
                    );
                }

                // Apply pagination
                const total = datasets.length;
                const paginatedDatasets = datasets.slice(offset, offset + limit);

                const result = {
                    total,
                    limit,
                    offset,
                    count: paginatedDatasets.length,
                    datasets: paginatedDatasets,
                };

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case "search_datasets": {
                const { query, source, limit = 10 } = args as unknown as SearchDatasetsArgs;
                const queryLower = query.toLowerCase();

                const datasets: Array<Dataset & { source: string }> = [];

                // Collect datasets from specified sources
                if (!source || source === "opendosm") {
                    datasets.push(
                        ...DATASETS_INDEX.opendosm.map((d) => ({ ...d, source: "opendosm" }))
                    );
                }
                if (!source || source === "data_catalogue") {
                    datasets.push(
                        ...DATASETS_INDEX.data_catalogue.map((d) => ({
                            ...d,
                            source: "data_catalogue",
                        }))
                    );
                }

                // Search and rank results
                const scoredDatasets: Array<[number, Dataset & { source: string }]> = [];

                for (const dataset of datasets) {
                    let score = 0;

                    // Exact ID match gets highest score
                    if (queryLower === dataset.id.toLowerCase()) {
                        score += 100;
                    } else if (dataset.id.toLowerCase().includes(queryLower)) {
                        score += 50;
                    }

                    // Name matching
                    if (dataset.name.toLowerCase().includes(queryLower)) {
                        score += 30;
                    }

                    // Description matching
                    if (dataset.description.toLowerCase().includes(queryLower)) {
                        score += 10;
                    }

                    // Keyword matching
                    for (const keyword of dataset.keywords || []) {
                        if (queryLower === keyword.toLowerCase()) {
                            score += 40;
                        } else if (keyword.toLowerCase().includes(queryLower)) {
                            score += 20;
                        }
                    }

                    if (score > 0) {
                        scoredDatasets.push([score, dataset]);
                    }
                }

                // Sort by score (descending) and apply limit
                scoredDatasets.sort((a, b) => b[0] - a[0]);
                const results = scoredDatasets.slice(0, limit).map(([_, dataset]) => dataset);

                const result = {
                    query,
                    count: results.length,
                    datasets: results,
                };

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case "get_dataset_schema": {
                const { dataset_id, source } = args as unknown as MetadataToolArgs;

                // Get dataset info from index
                const sourceKey: keyof DatasetsIndex = source === "opendosm" ? "opendosm" : "data_catalogue";
                const datasetInfo = DATASETS_INDEX[sourceKey]?.find(
                    (ds) => ds.id === dataset_id
                );

                // Get metadata from API
                let metadata;
                if (source === "opendosm") {
                    metadata = await apiClient.queryOpenDOSM(dataset_id, {
                        metaOnly: true,
                    });
                } else if (source === "data_catalogue") {
                    metadata = await apiClient.queryDataCatalogue(dataset_id, {
                        metaOnly: true,
                    });
                } else {
                    throw new Error(
                        "Invalid source. Must be 'opendosm' or 'data_catalogue'"
                    );
                }

                // Get sample data
                let sampleData;
                if (source === "opendosm") {
                    sampleData = await apiClient.queryOpenDOSM(dataset_id, { limit: 3 });
                } else {
                    sampleData = await apiClient.queryDataCatalogue(dataset_id, {
                        limit: 3,
                    });
                }

                const result = {
                    dataset_id,
                    source,
                    info: datasetInfo || { id: dataset_id, name: "Unknown" },
                    metadata,
                    sample_data: sampleData,
                };

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            error: errorMessage,
                            tool: name,
                            arguments: args,
                        },
                        null,
                        2
                    ),
                },
            ],
            isError: true,
        };
    }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, () => {
    return {
        resources: [
            {
                uri: "dataset://opendosm/all",
                name: "OpenDOSM Datasets",
                description: "List all OpenDOSM datasets",
                mimeType: "text/markdown",
            },
            {
                uri: "dataset://data-catalogue/all",
                name: "Data Catalogue Datasets",
                description: "List all Data Catalogue datasets",
                mimeType: "text/markdown",
            },
            {
                uri: "dataset://popular",
                name: "Popular Datasets",
                description: "List popular datasets from both sources",
                mimeType: "text/markdown",
            },
        ],
    };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, (request) => {
    const { uri } = request.params;

    switch (uri) {
        case "dataset://opendosm/all": {
            const datasets = DATASETS_INDEX.opendosm
                .map((d) => `- **${d.id}**: ${d.name} - ${d.description}`)
                .join("\n");
            return {
                contents: [
                    {
                        uri,
                        mimeType: "text/markdown",
                        text: `# OpenDOSM Datasets\n\n${datasets}`,
                    },
                ],
            };
        }

        case "dataset://data-catalogue/all": {
            const datasets = DATASETS_INDEX.data_catalogue
                .map((d) => `- **${d.id}**: ${d.name} - ${d.description}`)
                .join("\n");
            return {
                contents: [
                    {
                        uri,
                        mimeType: "text/markdown",
                        text: `# Data Catalogue Datasets\n\n${datasets}`,
                    },
                ],
            };
        }

        case "dataset://popular": {
            const popular: string[] = [];

            // Get first 10 from each source
            DATASETS_INDEX.opendosm.slice(0, 10).forEach((d) => {
                popular.push(`- **${d.id}** (OpenDOSM): ${d.name}`);
            });

            DATASETS_INDEX.data_catalogue.slice(0, 10).forEach((d) => {
                popular.push(`- **${d.id}** (Data Catalogue): ${d.name}`);
            });

            return {
                contents: [
                    {
                        uri,
                        mimeType: "text/markdown",
                        text: `# Popular Datasets\n\n${popular.join("\n")}`,
                    },
                ],
            };
        }

        default:
            throw new Error(`Unknown resource: ${uri}`);
    }
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    // Cleanup on exit
    process.on("SIGINT", () => {
        apiClient.close();
        process.exit(0);
    });

    process.on("SIGTERM", () => {
        apiClient.close();
        process.exit(0);
    });
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
