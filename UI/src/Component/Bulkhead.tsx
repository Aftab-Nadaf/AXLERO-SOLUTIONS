import { Layers3 } from "lucide-react";
import type { TelemetryResult } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface GatewayExecutorProps {
  telemetry: TelemetryResult<{
    active: number;
    poolSize: number;
    maximumPoolSize: number;
    queued: number;
  }> | null;
  isLoading: boolean;
}

const Bulkhead = ({ telemetry, isLoading }: GatewayExecutorProps) => {
  const executor = telemetry?.data;
  const hasFiniteMaximum = executor && executor.maximumPoolSize < 2_147_483_647;
  const utilization = hasFiniteMaximum && executor.maximumPoolSize > 0
    ? Math.min((executor.poolSize / executor.maximumPoolSize) * 100, 100)
    : null;

  return (
    <section className="telemetry-card" aria-labelledby="bulkhead-title">
      <div className="panel-heading">
        <span className="metric-icon is-success"><Layers3 size={19} /></span>
        <div>
          <h3 id="bulkhead-title">Application task executor</h3>
          <p>Live Actuator executor pool metrics</p>
        </div>
      </div>
      {executor ? (
        <div className="telemetry-detail-list">
          <div className="telemetry-stat-row">
            <div><span>Active tasks</span><strong>{executor.active.toLocaleString()}</strong></div>
            <div><span>Queued tasks</span><strong>{executor.queued.toLocaleString()}</strong></div>
          </div>
          <div className="telemetry-pool-row">
            <div className="telemetry-pool-heading">
              <strong>Pool size</strong>
              <span>
                {executor.poolSize.toLocaleString()}{" "}
                <small>/ {hasFiniteMaximum ? executor.maximumPoolSize.toLocaleString() : "unbounded"} max</small>
              </span>
            </div>
            {utilization !== null && (
              <div className="telemetry-progress-track is-small" role="img" aria-label={`${Math.round(utilization)} percent of the executor thread limit in use`}>
                <span style={{ width: `${utilization}%` }} />
              </div>
            )}
          </div>
          <p className="telemetry-footnote">This task executor is not the gateway request thread pool or a Resilience4j bulkhead.</p>
        </div>
      ) : (
        <TelemetryNotice
          message={isLoading ? "Loading executor metrics from the API Gateway…" : telemetry?.error ?? "Gateway executor metrics are unavailable."}
        />
      )}
    </section>
  );
};

export default Bulkhead;
