import { Activity, HeartPulse } from "lucide-react";
import type { TelemetryResult } from "../api/dashboardApi";
import TelemetryNotice from "./TelemetryNotice";

interface GatewayHealthProps {
  health: TelemetryResult<{ status: string; groups: string[] }> | null;
  isLoading: boolean;
}

const Testing = ({ health, isLoading }: GatewayHealthProps) => {
  const data = health?.data;
  const isHealthy = data?.status.toUpperCase() === "UP";

  return (
    <section className="tcontainer" aria-labelledby="gateway-health-title">
      <div className="t1">
        <HeartPulse size={37} aria-hidden="true" />
        <div>
          <h4 id="gateway-health-title">API Gateway health</h4>
          <p>Live status from the gateway Actuator</p>
        </div>
      </div>
      {data ? (
        <>
          <div className={`t2${isHealthy ? " is-healthy" : " is-failure"}`} role="status">
            <Activity size={25} aria-hidden="true" />
            <div>
              <h4>{data.status.toUpperCase()}</h4>
              <p>GET /actuator/health</p>
            </div>
          </div>
          {data.groups.length > 0 && (
            <div className="gateway-health-groups">
              <span>Health groups</span>
              {data.groups.map((group) => <code key={group}>{group}</code>)}
            </div>
          )}
        </>
      ) : (
        <TelemetryNotice
          message={isLoading ? "Checking API Gateway health…" : health?.error ?? "API Gateway health is unavailable."}
        />
      )}
      <p className="testing-note">
        <Activity size={15} aria-hidden="true" />
        No backend resilience controls are exposed through this gateway.
      </p>
    </section>
  );
};

export default Testing;
