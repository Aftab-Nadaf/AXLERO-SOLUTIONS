import { ChartNoAxesColumn, CircleAlert } from "lucide-react";
import type { DashboardData, InventoryLookup, Product } from "../api/dashboardApi";

interface ServiceDetailsProps {
  data: DashboardData | null;
  isLoading: boolean;
}

function getInventoryLabel(result: InventoryLookup | undefined) {
  if (!result) return { label: "Not checked", className: "is-muted" };
  if (result.kind === "not-found") return { label: "No stock record", className: "is-warning" };
  if (result.kind === "failed") return { label: "Unavailable", className: "is-warning" };

  const quantity = result.inventory.availableQuantity;
  return quantity > 0
    ? { label: result.inventory.status || "In stock", className: "" }
    : { label: result.inventory.status || "Out of stock", className: "is-warning" };
}

function ProductRow({
  product,
  inventoryResult,
}: {
  product: Product;
  inventoryResult: InventoryLookup | undefined;
}) {
  const inventory = inventoryResult?.kind === "loaded" ? inventoryResult.inventory : null;
  const inventoryStatus = getInventoryLabel(inventoryResult);

  return (
    <tr>
      <td>
        <div className="product-name">{product.name}</div>
        {product.description && <div className="product-description">{product.description}</div>}
      </td>
      <td>{product.category || "Uncategorized"}</td>
      <td>
        <span
          className={`table-status ${inventoryStatus.className}`}
          title={inventoryResult?.kind === "failed" ? inventoryResult.message : undefined}
        >
          {inventoryResult?.kind === "failed" && <CircleAlert size={13} aria-hidden="true" />}
          {inventoryStatus.label}
        </span>
      </td>
      <td>{inventory ? inventory.availableQuantity.toLocaleString() : "—"}</td>
      <td>{inventory ? inventory.reservedQuantity.toLocaleString() : "—"}</td>
      <td>{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
  );
}

const ServiceDetails = ({ data, isLoading }: ServiceDetailsProps) => {
  return (
    <section className="servicecontainer1">
      <div className="s1">
        <ChartNoAxesColumn size={22} aria-hidden="true" />
        <div>
          <h3>Catalog &amp; inventory</h3>
          <p>Live product and stock data from the connected APIs</p>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Inventory status</th>
              <th>Available</th>
              <th>Reserved</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((product) => (
              <ProductRow
                key={product.productId}
                product={product}
                inventoryResult={data.inventoryByProductId.get(product.productId)}
              />
            ))}
            {!data && (
              <tr>
                <td className="table-message" colSpan={6}>
                  {isLoading ? "Loading catalog and inventory…" : "Catalog data is unavailable."}
                </td>
              </tr>
            )}
            {data?.products.length === 0 && (
              <tr>
                <td className="table-message" colSpan={6}>
                  No products were returned by the catalog API.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ServiceDetails;
