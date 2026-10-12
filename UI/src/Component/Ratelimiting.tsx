import { Gauge } from "lucide-react";
import TelemetryNotice from "./TelemetryNotice";

const RateLimiting = () => (
  <section className="telemetry-card" aria-labelledby="rate-limiting-title">
    <div className="panel-heading">
      <span className="metric-icon"><Gauge size={19} /></span>
      <div>
        <h3 id="rate-limiting-title">Rate limiting</h3>
        <p>Request limits and usage</p>
      </div>
    </div>
    <TelemetryNotice message="Rate-limit usage metrics are not exposed by the connected APIs." />
  </section>
);

export default RateLimiting;
