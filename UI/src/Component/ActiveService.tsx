import { Activity, Boxes, CircleAlert, PackageCheck } from "lucide-react";
import type { DashboardData, InventoryApiStatus, InventoryLookup } from "../api/dashboardApi";

interface ActiveServiceProps {
  data: DashboardData | null;
  isLoading: boolean;
  recommendationStatus: "checking" | "service" | "fallback" | "unknown" | "unavailable";
}

function getStatusLabel(status: InventoryApiStatus) {
  switch (status) {
    case "online":
      return "Connected";
    case "partial":
      return "Partially connected";
    case "unavailable":
      return "Unavailable";
    case "unknown":
      return "Not checked";
  }
}

const ActiveService = ({ data, isLoading, recommendationStatus }: ActiveServiceProps) => {
  const inventoryRecords = data
    ? [...data.inventoryByProductId.values()].filter(
        (result): result is Extract<InventoryLookup, { kind: "loaded" }> =>
          result.kind === "loaded",
      )
    : [];
  const failedInventoryChecks = data
    ? [...data.inventoryByProductId.values()].filter((result) => result.kind === "failed").length
    : 0;
  const availableUnits = inventoryRecords.reduce(
    (total, result) => total + result.inventory.availableQuantity,
    0,
  );

  return (
    <section className="totalservicecontainer" aria-label="Catalog and inventory summary">
      <article className="metric-card">
        <div className="metric-card-top">
          <div>
            <p className="metric-label">Product API</p>
            <p className="metric-value">{data ? "Online" : isLoading ? "…" : "Offline"}</p>
          </div>
          <span className="metric-icon is-success"><Boxes size={19} /></span>
        </div>
        <p className="metric-detail">
          {data ? `${data.products.length} catalog products` : "Catalog service connection"}
        </p>
      </article>

      <article className="metric-card">
        <div className="metric-card-top">
          <div>
            <p className="metric-label">Inventory API</p>
            <p className="metric-value">
              {isLoading && !data ? "…" : data ? getStatusLabel(data.inventoryStatus) : "Unknown"}
            </p>
          </div>
          <span className="metric-icon is-warning"><PackageCheck size={19} /></span>
        </div>
        <p className="metric-detail">
          {data ? `${inventoryRecords.length} stock records loaded` : "Stock service connection"}
        </p>
      </article>

      <article className="metric-card">
        <div className="metric-card-top">
          <div>
            <p className="metric-label">Available units</p>
            <p className="metric-value">
              {data ? availableUnits.toLocaleString() : isLoading ? "…" : "—"}
            </p>
          </div>
          <span className="metric-icon"><Activity size={19} /></span>
        </div>
        <p className="metric-detail">
          {failedInventoryChecks > 0
            ? <><CircleAlert size={12} aria-hidden="true" /> {failedInventoryChecks} stock check{failedInventoryChecks === 1 ? "" : "s"} failed</>
            : "Across loaded inventory records"}
        </p>
      </article>

      <article className="metric-card">
        <div className="metric-card-top">
          <div>
            <p className="metric-label">Recommendation API</p>
            <p className="metric-value">
              {recommendationStatus === "checking"
                ? "Checking"
                : recommendationStatus === "service"
                  ? "Online"
                  : recommendationStatus === "fallback"
                    ? "Fallback"
                    : recommendationStatus === "unknown"
                      ? "Unverified"
                      : "Unavailable"}
            </p>
          </div>
          <span className={`metric-icon ${recommendationStatus === "service" ? "is-success" : "is-warning"}`}>
            <Boxes size={19} />
          </span>
        </div>
        <p className="metric-detail">
          {recommendationStatus === "fallback"
            ? "Showing gateway fallback data"
            : recommendationStatus === "unknown"
              ? "Gateway has not reported the response source"
            : "Live recommendation service connection"}
        </p>
      </article>
    </section>
  );
};

export default ActiveService;
