import { Boxes, CircleAlert, PackageCheck } from "lucide-react";
import type { DashboardData, InventoryLookup } from "../api/dashboardApi";

interface BackendServicePageProps {
  service: "products" | "inventory";
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

function getInventoryStatus(result: InventoryLookup | undefined) {
  if (!result) return "Not checked";
  if (result.kind === "not-found") return "No stock record";
  if (result.kind === "failed") return "Unavailable";
  return result.inventory.status || (result.inventory.availableQuantity > 0 ? "In stock" : "Out of stock");
}

const BackendServicePage = ({ service, data, isLoading, error }: BackendServicePageProps) => {
  const isProducts = service === "products";

  return (
    <main className="backend-service-page">
      <header className="backend-service-hero">
        <span className="backend-service-icon">
          {isProducts ? <Boxes size={20} /> : <PackageCheck size={20} />}
        </span>
        <div>
          <span className="api-panel-kicker">CONNECTED BACKEND SERVICE</span>
          <h1>{isProducts ? "Product catalog" : "Inventory"}</h1>
          <p>{isProducts
            ? "Products served by the product service through your API gateway."
            : "Live stock levels served by the inventory service through your API gateway."}</p>
        </div>
        <span className="backend-service-route">
          GET {isProducts ? "/products/products" : "/inventory/inventory/{productId}"}
        </span>
      </header>

      <section className="backend-service-panel" aria-live="polite">
        <div className="backend-service-panel-heading">
          <div>
            <span className="api-panel-kicker">LIVE DATA</span>
            <h2>{isProducts ? "Products" : "Stock by product"}</h2>
          </div>
          <span className="recommendation-count">
            {isLoading && !data ? "Loading…" : data ? `${data.products.length} products` : "Unavailable"}
          </span>
        </div>
        {error && (
          <div className="backend-service-error" role="alert">
            <strong>Could not refresh backend data</strong>
            <span>{error}</span>
            {data && <span>Showing the last successfully loaded records.</span>}
          </div>
        )}
        {!data && !isLoading ? (
          <div className="backend-service-error" role="alert">
            <strong>Backend data unavailable</strong>
            <span>Refresh the dashboard after confirming the API gateway and service are running.</span>
          </div>
        ) : isProducts ? (
          <div className="backend-service-table-wrap">
            <table className="backend-service-table">
              <thead><tr><th>Product</th><th>Category</th><th>Description</th><th>Price</th><th>Product ID</th></tr></thead>
              <tbody>
                {data?.products.map((product) => (
                  <tr key={product.productId}>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.category || "Uncategorized"}</td>
                    <td>{product.description || "—"}</td>
                    <td>{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{product.productId}</td>
                  </tr>
                ))}
                {isLoading && !data && <tr><td colSpan={5}>Loading products…</td></tr>}
                {data?.products.length === 0 && <tr><td colSpan={5}>No products found.</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="backend-service-table-wrap">
            <table className="backend-service-table">
              <thead><tr><th>Product</th><th>Product ID</th><th>Status</th><th>Available</th><th>Reserved</th></tr></thead>
              <tbody>
                {data?.products.map((product) => {
                  const record = data.inventoryByProductId.get(product.productId);
                  const inventory = record?.kind === "loaded" ? record.inventory : null;
                  return (
                    <tr key={product.productId}>
                      <td><strong>{product.name}</strong></td>
                      <td>{product.productId}</td>
                      <td className={record?.kind === "failed" ? "backend-service-cell-error" : ""}>
                        {record?.kind === "failed" && <CircleAlert size={13} />}
                        {getInventoryStatus(record)}
                      </td>
                      <td>{inventory?.availableQuantity.toLocaleString() ?? "—"}</td>
                      <td>{inventory?.reservedQuantity.toLocaleString() ?? "—"}</td>
                    </tr>
                  );
                })}
                {isLoading && !data && <tr><td colSpan={5}>Loading inventory…</td></tr>}
                {data?.products.length === 0 && <tr><td colSpan={5}>No inventory records found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default BackendServicePage;
