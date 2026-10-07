package com.axlero.inventoryservice.service;
<<<<<<< HEAD
import com.axlero.inventoryservice.entity.Inventory;
import java.util.Optional;

public interface InventoryService {
    Inventory saveInventory(Inventory inventory);
    Optional<Inventory> getInventoryByProductId(Long productId);
=======

import com.axlero.inventoryservice.dto.InventoryResponse;

public interface InventoryService {
	public InventoryResponse getInventoryByProductId(int productId);
>>>>>>> 974167375ba18699e9e01bb6b0fc96b5f0f0987f
}
