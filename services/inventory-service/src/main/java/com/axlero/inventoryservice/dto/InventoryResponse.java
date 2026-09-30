package com.axlero.inventoryservice.dto;

public class InventoryResponse {
	 
		private int productId;
	    private int availableQuantity;
	    private int reservedQuantity;
	    private String status;
	    
		public InventoryResponse(int productId, int availableQuantity, int reservedQuantity, String status) {
			super();
			this.productId = productId;
			this.availableQuantity = availableQuantity;
			this.reservedQuantity = reservedQuantity;
			this.status = status;
		}

		public int getProductId() {
			return productId;
		}

		public void setProductId(int productId) {
			this.productId = productId;
		}

		public int getAvailableQuantity() {
			return availableQuantity;
		}

		public void setAvailableQuantity(int availableQuantity) {
			this.availableQuantity = availableQuantity;
		}

		public int getReservedQuantity() {
			return reservedQuantity;
		}

		public void setReservedQuantity(int reservedQuantity) {
			this.reservedQuantity = reservedQuantity;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}
	    
	    
	    
	    
}
