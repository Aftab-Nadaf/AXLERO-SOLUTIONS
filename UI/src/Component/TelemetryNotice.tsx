import { Activity } from "lucide-react";

interface TelemetryNoticeProps {
  message?: string;
}

const TelemetryNotice = ({
  message = "Connect a monitoring endpoint to display live telemetry here.",
}: TelemetryNoticeProps) => (
  <div className="empty-state">
    <Activity size={18} aria-hidden="true" />
    <span>{message}</span>
  </div>
);

export default TelemetryNotice;
