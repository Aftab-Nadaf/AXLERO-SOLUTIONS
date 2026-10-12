import { Layers3 } from "lucide-react";
import TelemetryNotice from "./TelemetryNotice";

const Bulkhead = () => (
  <section className="telemetry-card" aria-labelledby="bulkhead-title">
    <div className="panel-heading">
      <span className="metric-icon is-success"><Layers3 size={19} /></span>
      <div>
        <h3 id="bulkhead-title">Bulkhead concurrency</h3>
        <p>Active and maximum concurrent calls</p>
      </div>
    </div>
    <TelemetryNotice message="Bulkhead metrics are not exposed by the connected APIs." />
  </section>
);

export default Bulkhead;
