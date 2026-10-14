import { FileText } from "lucide-react";
import type { TelemetryResult } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface LoggingProps {
  telemetry: TelemetryResult<{ info: number; warn: number; error: number }> | null;
  isLoading: boolean;
}

const Logging = ({ telemetry, isLoading }: LoggingProps) => {
  const events = telemetry?.data;

  return (
    <section className="telemetry-card" aria-labelledby="recent-events-title">
      <div className="panel-heading">
        <span className="metric-icon"><FileText size={19} /></span>
        <div>
          <h3 id="recent-events-title">Gateway log counters</h3>
          <p>Live Logback event totals since startup</p>
        </div>
      </div>
      {events ? (
        <div className="telemetry-state-list">
          <div className="telemetry-log-row">
            <span className="telemetry-event-level">INFO</span>
            <strong>{events.info.toLocaleString()}</strong>
            <span>events</span>
          </div>
          <div className="telemetry-log-row">
            <span className="telemetry-event-level is-warning">WARN</span>
            <strong>{events.warn.toLocaleString()}</strong>
            <span>events</span>
          </div>
          <div className="telemetry-log-row">
            <span className="telemetry-event-level is-error">ERROR</span>
            <strong>{events.error.toLocaleString()}</strong>
            <span>events</span>
          </div>
          <p className="telemetry-footnote">The gateway exposes aggregate counts, not individual log entries.</p>
        </div>
      ) : (
        <TelemetryNotice
          message={isLoading ? "Loading Logback counters from the API Gateway…" : telemetry?.error ?? "Gateway log counters are unavailable."}
        />
      )}
    </section>
  );
};

export default Logging;
