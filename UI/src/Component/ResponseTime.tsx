import { Clock3 } from "lucide-react";
import type { TelemetryResult } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface ResponseTimeProps {
  telemetry: TelemetryResult<{
    count: number;
    averageResponseMs: number | null;
    maxResponseMs: number | null;
    averagePerMinute: number | null;
  }> | null;
  isLoading: boolean;
}

const ResponseTime = ({ telemetry, isLoading }: ResponseTimeProps) => {
  const metrics = telemetry?.data;

  return (
    <section className="telemetry-card" aria-labelledby="response-time-title">
      <div className="panel-heading">
        <span className="metric-icon"><Clock3 size={19} /></span>
        <div>
          <h3 id="response-time-title">Gateway response time</h3>
          <p>Live HTTP request timer from Actuator</p>
        </div>
      </div>
      {metrics ? (
        <>
          <div className="telemetry-stat-row">
            <div>
              <span>Average response</span>
              <strong>{metrics.averageResponseMs === null ? "—" : `${metrics.averageResponseMs.toFixed(1)} ms`}</strong>
            </div>
            <div>
              <span>Maximum response</span>
              <strong>{metrics.maxResponseMs === null ? "—" : `${metrics.maxResponseMs.toFixed(1)} ms`}</strong>
            </div>
          </div>
          <p className="telemetry-footnote">
            Based on {metrics.count.toLocaleString()} gateway HTTP requests since startup, including Actuator polling.
          </p>
        </>
      ) : (
        <TelemetryNotice
          message={isLoading ? "Loading live response-time metrics from the API Gateway…" : telemetry?.error ?? "Gateway response-time metrics are unavailable."}
        />
      )}
    </section>
  );
};

export default ResponseTime;
