import { Shield } from "lucide-react";
import type { TelemetryResult } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface CircuitBreakerProps {
  telemetry: TelemetryResult<{
    name: string;
    state: string;
    successfulCalls: number;
    failedCalls: number;
  }> | null;
  isLoading: boolean;
}

function getStateLabel(state: string) {
  return state.replaceAll("_", " ").toUpperCase();
}

const CircuitBreakerStates = ({ telemetry, isLoading }: CircuitBreakerProps) => {
  const breaker = telemetry?.data;
  const isWarning = breaker?.state === "open" || breaker?.state === "half_open" || breaker?.state === "forced_open";

  return (
    <section className="telemetry-card" aria-labelledby="circuit-breaker-title">
      <div className="panel-heading">
        <span className={`metric-icon${isWarning ? " is-warning" : ""}`}><Shield size={19} /></span>
        <div>
          <h3 id="circuit-breaker-title">Circuit breaker state</h3>
          <p>Live Resilience4j gateway metric</p>
        </div>
      </div>
      {breaker ? (
        <div className="telemetry-state-list">
          <article className="telemetry-state-row">
            <div className="telemetry-state-service">
              <span className={`state-indicator${isWarning ? " is-warning" : ""}`} />
              <strong>{breaker.name}</strong>
            </div>
            <span className={`breaker-state${isWarning ? " is-warning" : ""}`}>
              {getStateLabel(breaker.state)}
            </span>
            <span className="telemetry-state-detail">
              {breaker.successfulCalls.toLocaleString()} successful <span>·</span> {breaker.failedCalls.toLocaleString()} failed calls
            </span>
          </article>
        </div>
      ) : (
        <TelemetryNotice
          message={isLoading ? "Loading circuit-breaker metrics from the API Gateway…" : telemetry?.error ?? "Circuit-breaker metrics are unavailable."}
        />
      )}
    </section>
  );
};

export default CircuitBreakerStates;
