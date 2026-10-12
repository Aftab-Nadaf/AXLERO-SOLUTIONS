import { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { Sun, Moon } from "lucide-react";
import type { InventoryApiStatus } from "../api/dashboardApi";

interface AppDetailsProps {
  isLoading: boolean;
  hasData: boolean;
  lastUpdated: Date | null;
  inventoryStatus: InventoryApiStatus;
  onRefresh: () => void;
}

const AppDetails = ({
  isLoading,
  hasData,
  lastUpdated,
  inventoryStatus,
  onRefresh,
}: AppDetailsProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const statusLabel = isLoading && !hasData
    ? "Connecting to APIs"
    : !hasData
      ? "API connection unavailable"
      : inventoryStatus === "online"
        ? "Connected APIs operational"
        : inventoryStatus === "partial"
          ? "Some inventory checks failed"
          : inventoryStatus === "unavailable"
            ? "Inventory API unavailable"
            : "Inventory status unknown";
  const statusClass = !hasData
    ? isLoading ? "is-muted" : "is-danger"
    : inventoryStatus === "online"
      ? ""
      : inventoryStatus === "partial" || inventoryStatus === "unknown"
        ? "is-warning"
        : "is-danger";

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <header className="Acontainer">
      <div>
        <h2>System Monitoring &amp; Resilience Dashboard</h2>
        <p>Live catalog and inventory data with service resilience at a glance</p>
      </div>
      <div className={`a1 ${statusClass}`} role="status">
        <FaCircle size={8} aria-hidden="true" />
        <span>{statusLabel}</span>
      </div>
      <div className="a2">
        <span>{lastUpdated ? `Synced ${lastUpdated.toLocaleTimeString()}` : "Not synced yet"}</span>
        <button onClick={onRefresh} disabled={isLoading} aria-label="Refresh dashboard data" title="Refresh data">
          <TbReload className={isLoading ? "animate-spin" : ""} />
        </button>
        <button
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
          title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default AppDetails;
