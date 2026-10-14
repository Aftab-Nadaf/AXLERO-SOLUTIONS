import { ExternalLink, Share2 } from "lucide-react";
import type { DistributedTrace, TelemetryResult } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface DistributedTracingProps {
  telemetry: TelemetryResult<DistributedTrace[]> | null;
  isLoading: boolean;
}

const zipkinUiUrl = (import.meta.env.VITE_ZIPKIN_UI_URL || "http://localhost:9411").replace(/\/+$/, "");

const Distributedtracing = ({ telemetry, isLoading }: DistributedTracingProps) => {
  const traces = telemetry?.data;

  return (
    <section className="telemetry-card" aria-labelledby="tracing-title">
      <div className="panel-heading">
        <span className="metric-icon"><Share2 size={19} /></span>
        <div>
          <h3 id="tracing-title">Distributed tracing</h3>
          <p>Recent end-to-end Zipkin traces</p>
        </div>
        <a
          className="zipkin-link"
          href={`${zipkinUiUrl}/zipkin/`}
          target="_blank"
          rel="noreferrer"
          title="Open the Zipkin UI"
        >
          View in Zipkin <ExternalLink size={13} />
        </a>
      </div>
      {traces?.length ? (
        <div className="telemetry-trace-list">
          {traces.map((trace) => (
            <article className="telemetry-trace-row" key={trace.traceId}>
              <div className="telemetry-trace-copy">
                <a
                  href={`${zipkinUiUrl}/zipkin/traces/${encodeURIComponent(trace.traceId)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open this trace in Zipkin"
                >
                  {trace.name}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
                <small>
                  {trace.services.length ? trace.services.join(" → ") : "Service name not reported"}
                  {trace.timestampMs === null ? "" : ` · ${new Date(trace.timestampMs).toLocaleString()}`}
                </small>
              </div>
              <div className="telemetry-trace-result">
                <strong>{trace.durationMs} ms</strong>
                <span className={trace.hasError ? "is-error" : ""}>
                  {trace.hasError ? "Error" : "Recorded"}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : traces ? (
        <TelemetryNotice message="No traces have been collected yet. Send a request through the API Gateway to generate one." />
      ) : (
        <TelemetryNotice
          message={
            isLoading
              ? "Loading recent traces from the Zipkin collector…"
              : telemetry?.error ?? "Zipkin traces are unavailable."
          }
        />
      )}
    </section>
  );
};

export default Distributedtracing;
