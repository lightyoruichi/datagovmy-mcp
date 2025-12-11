/**
 * API client for Malaysian government data APIs.
 */

const OPENDOSM_BASE_URL = "https://api.data.gov.my/opendosm";
const DATA_CATALOGUE_BASE_URL = "https://api.data.gov.my/data-catalogue";

export interface QueryOptions {
    filters?: Record<string, unknown>;
    limit?: number;
    offset?: number;
    metaOnly?: boolean;
}

/**
 * Client for querying OpenDOSM and Data Catalogue APIs.
 */
export class DataGovMyClient {
    private abortController: AbortController | null = null;

    /**
     * Query an OpenDOSM dataset.
     */
    async queryOpenDOSM(
        datasetId: string,
        options: QueryOptions = {}
    ): Promise<unknown> {
        const { filters, limit = 100, offset = 0, metaOnly = false } = options;

        const params = new URLSearchParams({ id: datasetId });

        if (metaOnly) {
            params.append("meta_only", "true");
        } else {
            params.append("limit", limit.toString());
            params.append("offset", offset.toString());
        }

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                params.append(key, String(value));
            });
        }

        this.abortController = new AbortController();
        const url = `${OPENDOSM_BASE_URL}?${params.toString()}`;
        const response = await fetch(url, {
            signal: this.abortController.signal,
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `OpenDOSM API error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }

    /**
     * Query a Data Catalogue dataset.
     */
    async queryDataCatalogue(
        datasetId: string,
        options: QueryOptions = {}
    ): Promise<unknown> {
        const { filters, limit = 100, offset = 0, metaOnly = false } = options;

        const params = new URLSearchParams({ id: datasetId });

        if (metaOnly) {
            params.append("meta_only", "true");
        } else {
            params.append("limit", limit.toString());
            params.append("offset", offset.toString());
        }

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                params.append(key, String(value));
            });
        }

        this.abortController = new AbortController();
        const url = `${DATA_CATALOGUE_BASE_URL}?${params.toString()}`;
        const response = await fetch(url, {
            signal: this.abortController.signal,
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Data Catalogue API error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }

    /**
     * Close the client and cancel any pending requests.
     */
    close() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
}
