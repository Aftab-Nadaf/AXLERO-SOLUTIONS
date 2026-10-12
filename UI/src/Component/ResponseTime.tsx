import { Clock3 } from "lucide-react";
import TelemetryNotice from "./TelemetryNotice";

const ResponseTime = () => (
  <section className="telemetry-card" aria-labelledby="response-time-title">
    <div className="panel-heading">
      <span className="metric-icon"><Clock3 size={19} /></span>
      <div>
        <h3 id="response-time-title">Response time</h3>
        <p>Service latency overview</p>
      </div>
    </div>
    <TelemetryNotice message="Response-time metrics are not exposed by the connected APIs." />
  </section>
);

export default ResponseTime;
