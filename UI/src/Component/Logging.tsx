import { FileText } from "lucide-react";
import TelemetryNotice from "./TelemetryNotice";

const Logging = () => (
  <section className="telemetry-card" aria-labelledby="recent-events-title">
    <div className="panel-heading">
      <span className="metric-icon"><FileText size={19} /></span>
      <div>
        <h3 id="recent-events-title">Recent events</h3>
        <p>Latest service activity</p>
      </div>
    </div>
    <TelemetryNotice message="An events endpoint is not configured for this dashboard." />
  </section>
);

export default Logging;
