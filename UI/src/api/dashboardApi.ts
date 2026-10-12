import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

export interface Product {
  productId: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
}

export interface InventoryRecord {
  productId: number;
  availableQuantity: number;
  reservedQuantity: number;
  status: string | null;
}

export type InventoryLookup =
  | { kind: "loaded"; inventory: InventoryRecord }
  | { kind: "not-found" }
  | { kind: "failed"; message: string };

export type InventoryApiStatus = "online" | "partial" | "unavailable" | "unknown";

export interface DashboardData {
  products: Product[];
  inventoryByProductId: Map<number, InventoryLookup>;
  inventoryStatus: InventoryApiStatus;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.productId === "number" &&
    Number.isFinite(value.productId) &&
    typeof value.name === "string" &&
    (typeof value.description === "string" || value.description === null) &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    (typeof value.category === "string" || value.category === null)
  );
}

function isInventoryRecord(value: unknown): value is InventoryRecord {
  return (
    isRecord(value) &&
    typeof value.productId === "number" &&
    Number.isFinite(value.productId) &&
    typeof value.availableQuantity === "number" &&
    Number.isFinite(value.availableQuantity) &&
    typeof value.reservedQuantity === "number" &&
    Number.isFinite(value.reservedQuantity) &&
    (typeof value.status === "string" || value.status === null)
  );
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Could not reach the API. Check that the API gateway is running.";
    }

    return `The API returned HTTP ${error.response.status}.`;
  }

  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export async function getDashboardData(signal?: AbortSignal): Promise<DashboardData> {
  const response = await api.get<Product[]>("/products", { signal });
  if (!Array.isArray(response.data) || !response.data.every(isProduct)) {
    throw new Error("The products API returned an unexpected response.");
  }

  const inventoryResults = await Promise.all(
    response.data.map(async (product): Promise<[number, InventoryLookup]> => {
      try {
        const inventoryResponse = await api.get<InventoryRecord>(
          `/inventory/${product.productId}`,
          { signal },
        );

        if (!isInventoryRecord(inventoryResponse.data)) {
          throw new Error("The inventory API returned an unexpected response.");
        }

        return [product.productId, { kind: "loaded", inventory: inventoryResponse.data }];
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return [product.productId, { kind: "not-found" }];
        }

        return [
          product.productId,
          { kind: "failed", message: getApiErrorMessage(error) },
        ];
      }
    }),
  );

  const inventoryByProductId = new Map(inventoryResults);
  const failedRequests = inventoryResults.filter(([, result]) => result.kind === "failed").length;
  const completedRequests = inventoryResults.length - failedRequests;
  const inventoryStatus: InventoryApiStatus =
    inventoryResults.length === 0
      ? "unknown"
      : failedRequests === 0
        ? "online"
        : completedRequests === 0
          ? "unavailable"
          : "partial";

  return {
    products: response.data,
    inventoryByProductId,
    inventoryStatus,
  };
}
