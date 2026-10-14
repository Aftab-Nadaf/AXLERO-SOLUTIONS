import { Gauge } from "lucide-react";
import type { RateLimitStatus } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface RateLimitingProps {
  rateLimit: RateLimitStatus | null;
}

const RateLimiting = ({ rateLimit }: RateLimitingProps) => {
  const used = rateLimit ? rateLimit.limit - rateLimit.remaining : 0;
  const usedPercent = rateLimit ? (used / rateLimit.limit) * 100 : 0;

  return (
    <section className="telemetry-card" aria-labelledby="rate-limiting-title">
      <div className="panel-heading">
        <span className="metric-icon"><Gauge size={19} /></span>
        <div>
          <h3 id="rate-limiting-title">Rate limit</h3>
          <p>Latest API Gateway response headers</p>
        </div>
      </div>
      {rateLimit ? (
        <>
          <div className="telemetry-limit-summary">
            <div>
              <strong>{rateLimit.remaining.toLocaleString()}</strong>
              <span>of {rateLimit.limit.toLocaleString()} requests remaining</span>
            </div>
            <span>{used.toLocaleString()} used in this window</span>
          </div>
          <div
            className="telemetry-progress-track"
            role="img"
            aria-label={`${Math.round(usedPercent)} percent of the observed gateway rate limit used`}
          >
            <span style={{ width: `${usedPercent}%` }} />
          </div>
          <p className="telemetry-footnote">
            Observed {new Date(rateLimit.observedAt).toLocaleTimeString()} from a real recommendation API response.
          </p>
        </>
      ) : (
        <TelemetryNotice message="No rate-limit headers were returned yet. The API Gateway reports these headers on /api requests." />
      )}
    </section>
  );
};

export default RateLimiting;
