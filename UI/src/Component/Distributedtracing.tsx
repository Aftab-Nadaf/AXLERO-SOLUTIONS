import { ExternalLink, Share2 } from "lucide-react";
import TelemetryNotice from "./TelemetryNotice";

const Distributedtracing = () => (
  <section className="telemetry-card" aria-labelledby="tracing-title">
    <div className="panel-heading">
      <span className="metric-icon"><Share2 size={19} /></span>
      <div>
        <h3 id="tracing-title">Distributed tracing</h3>
        <p>Zipkin trace activity</p>
      </div>
      <span className="disabled-link" aria-disabled="true" title="Zipkin URL is not configured">
        View in Zipkin <ExternalLink size={13} />
      </span>
    </div>
    <TelemetryNotice message="Trace data is not available from the configured API gateway." />
  </section>
);

export default Distributedtracing;
