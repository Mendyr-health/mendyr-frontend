import { Client } from "@opensearch-project/opensearch";
import { createChildLogger } from "./logger";

const log = createChildLogger("opensearch");

const globalForOpenSearch = globalThis as unknown as { opensearch: Client };

function createOpenSearchClient(): Client {
  const node = process.env.OPENSEARCH_URL || "http://localhost:9200";
  const auth =
    process.env.OPENSEARCH_USERNAME && process.env.OPENSEARCH_PASSWORD
      ? {
          username: process.env.OPENSEARCH_USERNAME,
          password: process.env.OPENSEARCH_PASSWORD,
        }
      : undefined;

  return new Client({
    node,
    auth,
    ssl: { rejectUnauthorized: false },
  });
}

export const opensearch = globalForOpenSearch.opensearch ?? createOpenSearchClient();

if (process.env.NODE_ENV !== "production") globalForOpenSearch.opensearch = opensearch;

// ── Index Names ──────────────────────────────────

export const INDICES = {
  nurses: "mendyr_nurses",
  patients: "mendyr_patients",
  services: "mendyr_services",
  contacts: "mendyr_contacts",
  waitlist: "mendyr_waitlist",
} as const;

// ── Index Mappings ──────────────────────────────

const MAPPINGS: Record<string, object> = {
  [INDICES.nurses]: {
    properties: {
      publicId: { type: "keyword" },
      fullName: { type: "text", analyzer: "standard" },
      email: { type: "keyword" },
      phone: { type: "keyword" },
      city: { type: "keyword" },
      state: { type: "keyword" },
      experience: { type: "text" },
      qualifications: { type: "text" },
      verificationStatus: { type: "keyword" },
      createdAt: { type: "date" },
    },
  },
  [INDICES.patients]: {
    properties: {
      publicId: { type: "keyword" },
      fullName: { type: "text", analyzer: "standard" },
      email: { type: "keyword" },
      phone: { type: "keyword" },
      city: { type: "keyword" },
      registrationStatus: { type: "keyword" },
      createdAt: { type: "date" },
    },
  },
  [INDICES.services]: {
    properties: {
      publicId: { type: "keyword" },
      name: { type: "text", analyzer: "standard" },
      slug: { type: "keyword" },
      description: { type: "text" },
      isActive: { type: "boolean" },
      createdAt: { type: "date" },
    },
  },
  [INDICES.contacts]: {
    properties: {
      publicId: { type: "keyword" },
      name: { type: "text", analyzer: "standard" },
      email: { type: "keyword" },
      subject: { type: "text" },
      message: { type: "text" },
      status: { type: "keyword" },
      createdAt: { type: "date" },
    },
  },
  [INDICES.waitlist]: {
    properties: {
      publicId: { type: "keyword" },
      email: { type: "keyword" },
      name: { type: "text", analyzer: "standard" },
      source: { type: "keyword" },
      notified: { type: "boolean" },
      createdAt: { type: "date" },
    },
  },
};

/**
 * Ensure all indices exist with proper mappings.
 */
export async function setupIndices(): Promise<void> {
  for (const [indexName, mapping] of Object.entries(MAPPINGS)) {
    try {
      const { body: exists } = await opensearch.indices.exists({ index: indexName });
      if (!exists) {
        await opensearch.indices.create({
          index: indexName,
          body: { mappings: mapping },
        });
        log.info({ index: indexName }, "Index created");
      }
    } catch (err) {
      log.error({ index: indexName, err }, "Index setup error");
    }
  }
}

/**
 * Index a document.
 */
export async function indexDocument(
  index: string,
  id: string,
  body: Record<string, unknown>
): Promise<void> {
  try {
    await opensearch.index({ index, id, body, refresh: true });
  } catch (err) {
    log.error({ index, id, err }, "Indexing error");
  }
}

/**
 * Delete a document from an index.
 */
export async function deleteDocument(index: string, id: string): Promise<void> {
  try {
    await opensearch.delete({ index, id, refresh: true });
  } catch (err) {
    log.error({ index, id, err }, "Delete document error");
  }
}

/**
 * Search with full-text + filters + sort + pagination.
 */
export async function searchDocuments(
  index: string,
  options: {
    query?: string;
    filters?: Record<string, string | string[] | boolean>;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }
): Promise<{ hits: Array<{ _id: string; _source: Record<string, unknown> }>; total: number }> {
  const { query, filters, sortBy, sortOrder = "desc", page = 1, limit = 20 } = options;
  const from = (page - 1) * limit;

  const must: object[] = [];
  const filter: object[] = [];

  // Full-text search
  if (query) {
    must.push({
      multi_match: {
        query,
        fields: ["fullName^3", "name^3", "email^2", "subject", "description", "message", "experience"],
        type: "best_fields",
        fuzziness: "AUTO",
      },
    });
  }

  // Filters
  if (filters) {
    for (const [field, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        filter.push({ terms: { [field]: value } });
      } else if (typeof value === "boolean") {
        filter.push({ term: { [field]: value } });
      } else {
        filter.push({ term: { [field]: value } });
      }
    }
  }

  const body: Record<string, unknown> = {
    from,
    size: limit,
    query: {
      bool: {
        ...(must.length > 0 ? { must } : { must: [{ match_all: {} }] }),
        ...(filter.length > 0 ? { filter } : {}),
      },
    },
  };

  if (sortBy) {
    body.sort = [{ [sortBy]: { order: sortOrder } }];
  } else {
    body.sort = [{ createdAt: { order: "desc" } }];
  }

  try {
    const { body: result } = await opensearch.search({ index, body });
    return {
      hits: result.hits.hits as unknown as Array<{ _id: string; _source: Record<string, unknown> }>,
      total:
        typeof result.hits.total === "number"
          ? result.hits.total
          : result.hits.total?.value ?? 0,
    };
  } catch (err) {
    log.error({ index, err }, "Search error");
    return { hits: [], total: 0 };
  }
}
