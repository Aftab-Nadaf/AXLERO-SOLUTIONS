import axios from "axios";

const gatewayApi = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || "",
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

export type ApiEndpoint = "products" | "product" | "inventory" | "recommendations";

export interface ApiRequestResult {
  status: number;
  statusText: string;
  durationMs: number;
  data: unknown;
  rateLimit: RateLimitStatus | null;
}

export interface RecommendedProduct {
  productId: number;
  name: string;
}

export interface RecommendationsResponse {
  userId: number;
  recommendations: RecommendedProduct[];
  source: "service" | "fallback" | "unknown";
  rateLimit: RateLimitStatus | null;
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  observedAt: number;
}

export interface DistributedTrace {
  traceId: string;
  name: string;
  services: string[];
  durationMs: number;
  timestampMs: number | null;
  hasError: boolean;
}

export interface TelemetryResult<T> {
  data: T | null;
  error: string | null;
}

export interface GatewayTelemetry {
  health: TelemetryResult<{ status: string; groups: string[] }>;
  requests: TelemetryResult<{
    count: number;
    averageResponseMs: number | null;
    maxResponseMs: number | null;
    averagePerMinute: number | null;
    averagePerMinuteError: string | null;
  }>;
  circuitBreaker: TelemetryResult<{
    name: string;
    state: string;
    successfulCalls: number;
    failedCalls: number;
  }>;
  executor: TelemetryResult<{
    active: number;
    poolSize: number;
    maximumPoolSize: number;
    queued: number;
  }>;
  logEvents: TelemetryResult<{ info: number; warn: number; error: number }>;
  traces: TelemetryResult<DistributedTrace[]>;
  updatedAt: number;
}

interface ZipkinSpan {
  traceId: string;
  id: string;
  parentId?: string;
  name: string;
  timestamp?: number;
  duration?: number;
  localEndpoint?: { serviceName?: string };
  tags?: Record<string, string>;
}

interface ActuatorMetric {
  measurements: Array<{ statistic: string; value: number }>;
}

interface ActuatorHealth {
  status: string;
  groups?: string[];
}

type RecommendationsPayload = Pick<RecommendationsResponse, "userId" | "recommendations">;

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

function isRecommendationsResponse(value: unknown): value is RecommendationsPayload {
  return (
    isRecord(value) &&
    typeof value.userId === "number" &&
    Number.isFinite(value.userId) &&
    Array.isArray(value.recommendations) &&
    value.recommendations.every(
      (product) =>
        isRecord(product) &&
        typeof product.productId === "number" &&
        Number.isFinite(product.productId) &&
        typeof product.name === "string",
    )
  );
}

function isActuatorMetric(value: unknown): value is ActuatorMetric {
  return (
    isRecord(value) &&
    Array.isArray(value.measurements) &&
    value.measurements.every(
      (measurement) =>
        isRecord(measurement) &&
        typeof measurement.statistic === "string" &&
        typeof measurement.value === "number" &&
        Number.isFinite(measurement.value),
    )
  );
}

function isActuatorHealth(value: unknown): value is ActuatorHealth {
  return (
    isRecord(value) &&
    typeof value.status === "string" &&
    (value.groups === undefined ||
      (Array.isArray(value.groups) && value.groups.every((group) => typeof group === "string")))
  );
}

function isZipkinSpan(value: unknown): value is ZipkinSpan {
  return (
    isRecord(value) &&
    typeof value.traceId === "string" &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (value.parentId === undefined || typeof value.parentId === "string") &&
    (value.timestamp === undefined ||
      (typeof value.timestamp === "number" && Number.isFinite(value.timestamp))) &&
    (value.duration === undefined ||
      (typeof value.duration === "number" && Number.isFinite(value.duration))) &&
    (value.localEndpoint === undefined ||
      (isRecord(value.localEndpoint) &&
        (value.localEndpoint.serviceName === undefined ||
          typeof value.localEndpoint.serviceName === "string"))) &&
    (value.tags === undefined ||
      (isRecord(value.tags) &&
        Object.values(value.tags).every((tag) => typeof tag === "string")))
  );
}

function getMetricValue(metric: ActuatorMetric, statistic: string): number {
  const measurement = metric.measurements.find((item) => item.statistic === statistic);
  if (!measurement) {
    throw new Error(`The API Gateway metric did not include ${statistic}.`);
  }
  return measurement.value;
}

function parseRateLimitHeaders(limitHeader: unknown, remainingHeader: unknown): RateLimitStatus | null {
  const limit = Number(limitHeader);
  const remaining = Number(remainingHeader);
  return Number.isSafeInteger(limit) &&
    Number.isSafeInteger(remaining) &&
    limit > 0 &&
    remaining >= 0 &&
    remaining <= limit
    ? { limit, remaining, observedAt: Date.now() }
    : null;
}

async function loadTelemetryResult<T>(
  label: string,
  load: () => Promise<T>,
  signal?: AbortSignal,
): Promise<TelemetryResult<T>> {
  try {
    return { data: await load(), error: null };
  } catch (error) {
    if (signal?.aborted) throw error;
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { data: null, error: `${label} is not exposed by the API Gateway.` };
    }
    return { data: null, error: getApiErrorMessage(error) };
  }
}

async function getActuatorMetric(
  name: string,
  tags: Record<string, string> = {},
  signal?: AbortSignal,
): Promise<ActuatorMetric> {
  const params = new URLSearchParams();
  Object.entries(tags).forEach(([key, value]) => params.append("tag", `${key}:${value}`));
  const query = params.size > 0 ? `?${params.toString()}` : "";
  const response = await gatewayApi.get<unknown>(
    `/actuator/metrics/${encodeURIComponent(name)}${query}`,
    { signal },
  );
  if (!isActuatorMetric(response.data)) {
    throw new Error(`The API Gateway returned an unexpected ${name} metric.`);
  }
  return response.data;
}

async function getMetricValueResult(
  name: string,
  statistic: string,
  tags: Record<string, string> = {},
  signal?: AbortSignal,
): Promise<TelemetryResult<number>> {
  return loadTelemetryResult(
    name,
    async () => getMetricValue(await getActuatorMetric(name, tags, signal), statistic),
    signal,
  );
}

async function getCircuitBreakerState(
  signal?: AbortSignal,
): Promise<{ name: string; state: string; successfulCalls: number; failedCalls: number }> {
  const name = "recommendationCircuitBreaker";
  const states = ["closed", "open", "half_open", "forced_open", "disabled", "metrics_only"];
  const stateResults = await Promise.all(
    states.map(async (state) => ({
      state,
      value: await getMetricValue(
        await getActuatorMetric(
          "resilience4j.circuitbreaker.state",
          { name, state },
          signal,
        ),
        "VALUE",
      ),
    })),
  );
  const activeStates = stateResults.filter(({ value }) => value > 0);
  if (activeStates.length !== 1) {
    throw new Error("The API Gateway did not report a single active recommendation circuit-breaker state.");
  }

  const [successfulCalls, failedCalls] = await Promise.all(
    ["successful", "failed"].map(async (kind) =>
      getMetricValue(
        await getActuatorMetric(
          "resilience4j.circuitbreaker.calls",
          { name, kind },
          signal,
        ),
        "COUNT",
      ),
    ),
  );

  return {
    name,
    state: activeStates[0].state,
    successfulCalls,
    failedCalls,
  };
}

async function getGatewayRequests(
  signal?: AbortSignal,
): Promise<{
  count: number;
  averageResponseMs: number | null;
  maxResponseMs: number | null;
  averagePerMinute: number | null;
  averagePerMinuteError: string | null;
}> {
  const [requests, uptime] = await Promise.all([
    getActuatorMetric("http.server.requests", {}, signal),
    getMetricValueResult("process.uptime", "VALUE", {}, signal),
  ]);
  const count = getMetricValue(requests, "COUNT");
  const totalTime = getMetricValue(requests, "TOTAL_TIME");
  const maxTime = getMetricValue(requests, "MAX");
  const uptimeSeconds = uptime.data;

  return {
    count,
    averageResponseMs: count > 0 ? (totalTime / count) * 1000 : null,
    maxResponseMs: maxTime * 1000,
    averagePerMinute: uptimeSeconds && uptimeSeconds > 0
      ? (count / uptimeSeconds) * 60
      : null,
    averagePerMinuteError: uptime.error,
  };
}

async function getZipkinTraces(signal?: AbortSignal): Promise<DistributedTrace[]> {
  const response = await gatewayApi.get<unknown>("/api/traces?limit=10", { signal });
  if (!Array.isArray(response.data) ||
    !response.data.every((trace) => Array.isArray(trace) && trace.every(isZipkinSpan))) {
    throw new Error("The API Gateway returned an unexpected Zipkin trace response.");
  }

  return response.data
    .map((trace: ZipkinSpan[]) => {
      const orderedSpans = [...trace].sort(
        (left, right) => (left.timestamp ?? 0) - (right.timestamp ?? 0),
      );
      const rootSpan = orderedSpans.find((span) => span.parentId === undefined) ?? orderedSpans[0];
      const durations = trace.flatMap((span) => span.duration === undefined ? [] : [span.duration]);
      const services = [...new Set(
        orderedSpans.flatMap((span) => span.localEndpoint?.serviceName ? [span.localEndpoint.serviceName] : []),
      )];
      const statusCode = Number(rootSpan.tags?.["http.status_code"] ?? rootSpan.tags?.["http.response.status_code"]);

      return {
        traceId: rootSpan.traceId,
        name: rootSpan.name,
        services,
        durationMs: durations.length ? Math.round(Math.max(...durations) / 1000) : 0,
        timestampMs: orderedSpans[0].timestamp === undefined
          ? null
          : Math.round(orderedSpans[0].timestamp / 1000),
        hasError: Boolean(rootSpan.tags?.error) || statusCode >= 500,
      };
    })
    .sort((left, right) => (right.timestampMs ?? 0) - (left.timestampMs ?? 0));
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

export async function requestApiEndpoint(
  endpoint: ApiEndpoint,
  id?: number,
): Promise<ApiRequestResult> {
  const requiresId = endpoint !== "products";
  if (requiresId && (typeof id !== "number" || !Number.isSafeInteger(id) || id < 1)) {
    throw new Error("Enter a valid positive whole-number ID.");
  }

  const path = endpoint === "products"
    ? "/products/products"
    : endpoint === "product"
      ? `/products/products/${id}`
      : endpoint === "inventory"
        ? `/inventory/inventory/${id}`
        : `/api/recommendations/${id}`;
  const startedAt = performance.now();
  const response = await gatewayApi.get<unknown>(path);

  return {
    status: response.status,
    statusText: response.statusText || "Response",
    durationMs: Math.round(performance.now() - startedAt),
    data: response.data,
    rateLimit: parseRateLimitHeaders(
      response.headers["x-ratelimit-limit"],
      response.headers["x-ratelimit-remaining"],
    ),
  };
}

export async function getRecommendations(
  userId: number,
  signal?: AbortSignal,
): Promise<RecommendationsResponse> {
  if (!Number.isSafeInteger(userId) || userId < 1) {
    throw new Error("Enter a valid positive whole-number user ID.");
  }

  const response = await gatewayApi.get<unknown>(`/api/recommendations/${userId}`, { signal });
  if (!isRecommendationsResponse(response.data)) {
    throw new Error("The recommendations API returned an unexpected response.");
  }

  return {
    ...response.data,
    source: response.headers["x-recommendation-source"] === "fallback"
      ? "fallback"
      : response.headers["x-recommendation-source"] === "service"
        ? "service"
        : "unknown",
    rateLimit: parseRateLimitHeaders(
      response.headers["x-ratelimit-limit"],
      response.headers["x-ratelimit-remaining"],
    ),
  };
}

export async function getGatewayTelemetry(signal?: AbortSignal): Promise<GatewayTelemetry> {
  const [health, requests, circuitBreaker, executor, logEvents, traces] =
    await Promise.all([
      loadTelemetryResult(
        "Gateway health",
        async () => {
          const response = await gatewayApi.get<unknown>("/actuator/health", { signal });
          if (!isActuatorHealth(response.data)) {
            throw new Error("The API Gateway returned an unexpected health response.");
          }
          return { status: response.data.status, groups: response.data.groups ?? [] };
        },
        signal,
      ),
      loadTelemetryResult("Gateway HTTP request metrics", () => getGatewayRequests(signal), signal),
      loadTelemetryResult("Recommendation circuit-breaker metrics", () => getCircuitBreakerState(signal), signal),
      loadTelemetryResult(
        "Gateway executor metrics",
        async () => {
          const [active, poolSize, maximumPoolSize, queued] = await Promise.all(
            ["executor.active", "executor.pool.size", "executor.pool.max", "executor.queued"].map(
              (name) => getActuatorMetric(name, {}, signal),
            ),
          );
          return {
            active: getMetricValue(active, "VALUE"),
            poolSize: getMetricValue(poolSize, "VALUE"),
            maximumPoolSize: getMetricValue(maximumPoolSize, "VALUE"),
            queued: getMetricValue(queued, "VALUE"),
          };
        },
        signal,
      ),
      loadTelemetryResult(
        "Gateway log counters",
        async () => {
          const levels = ["info", "warn", "error"] as const;
          const values = await Promise.all(
            levels.map(async (level) =>
              getMetricValue(
                await getActuatorMetric("logback.events", { level }, signal),
                "COUNT",
              ),
            ),
          );
          return { info: values[0], warn: values[1], error: values[2] };
        },
        signal,
      ),
      loadTelemetryResult(
        "Zipkin tracing collector",
        () => getZipkinTraces(signal),
        signal,
      ),
    ]);

  return {
    health,
    requests,
    circuitBreaker,
    executor,
    logEvents,
    traces,
    updatedAt: Date.now(),
  };
}

export async function getDashboardData(signal?: AbortSignal): Promise<DashboardData> {
  const response = await gatewayApi.get<Product[]>("/products/products", { signal });
  if (!Array.isArray(response.data) || !response.data.every(isProduct)) {
    throw new Error("The products API returned an unexpected response.");
  }

  const inventoryResults = await Promise.all(
    response.data.map(async (product): Promise<[number, InventoryLookup]> => {
      try {
        const inventoryResponse = await gatewayApi.get<InventoryRecord>(
          `/inventory/inventory/${product.productId}`,
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
