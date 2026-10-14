import { ChartNoAxesColumnIncreasing } from "lucide-react";
import type { TelemetryResult } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface RequestRateProps {
  telemetry: TelemetryResult<{
    count: number;
    averageResponseMs: number | null;
    maxResponseMs: number | null;
    averagePerMinute: number | null;
    averagePerMinuteError: string | null;
  }> | null;
  isLoading: boolean;
}

const RequestRate = ({ telemetry, isLoading }: RequestRateProps) => {
  const metrics = telemetry?.data;

  return (
    <section className="telemetry-card" aria-labelledby="request-rate-title">
      <div className="panel-heading">
        <span className="metric-icon"><ChartNoAxesColumnIncreasing size={19} /></span>
        <div>
          <h3 id="request-rate-title">Gateway request rate</h3>
          <p>Live HTTP request counter from Actuator</p>
        </div>
      </div>
      {metrics ? (
        <div className="telemetry-stat-row">
          <div>
            <span>Requests since startup</span>
            <strong>{metrics.count.toLocaleString()}</strong>
          </div>
          <div>
            <span>Average since startup</span>
            <strong>{metrics.averagePerMinute === null ? "—" : `${metrics.averagePerMinute.toFixed(1)} / min`}</strong>
          </div>
        </div>
      ) : (
        <TelemetryNotice
          message={isLoading ? "Loading live request counters from the API Gateway…" : telemetry?.error ?? "Gateway request metrics are unavailable."}
        />
      )}
      {metrics && (
        <>
          {metrics.averagePerMinuteError && (
            <p className="telemetry-footnote">{metrics.averagePerMinuteError}</p>
          )}
          <p className="telemetry-footnote">Counts include gateway Actuator requests made while loading this dashboard.</p>
        </>
      )}
    </section>
  );
};

export default RequestRate;
