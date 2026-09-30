package com.axlero.inventoryservice.service;

import com.axlero.inventoryservice.dto.InventoryResponse;

public interface InventoryService {
	public InventoryResponse getInventoryByProductId(int productId);
}
