import { Shield } from "lucide-react";
import TelemetryNotice from "./TelemetryNotice";

const CircuitBreakerStates = () => (
  <section className="telemetry-card" aria-labelledby="circuit-breaker-title">
    <div className="panel-heading">
      <span className="metric-icon is-warning"><Shield size={19} /></span>
      <div>
        <h3 id="circuit-breaker-title">Circuit breaker states</h3>
        <p>State by service</p>
      </div>
    </div>
    <TelemetryNotice message="Circuit-breaker state endpoints are not configured." />
  </section>
);

export default CircuitBreakerStates;
