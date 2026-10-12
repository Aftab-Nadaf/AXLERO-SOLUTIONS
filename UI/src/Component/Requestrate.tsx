import { ChartNoAxesColumnIncreasing } from "lucide-react";
import TelemetryNotice from "./TelemetryNotice";

const RequestRate = () => (
  <section className="telemetry-card" aria-labelledby="request-rate-title">
    <div className="panel-heading">
      <span className="metric-icon"><ChartNoAxesColumnIncreasing size={19} /></span>
      <div>
        <h3 id="request-rate-title">Request rate</h3>
        <p>Request volume over the last 15 minutes</p>
      </div>
    </div>
    <TelemetryNotice message="Historical request-rate metrics are not available from the connected APIs." />
  </section>
);

export default RequestRate;
