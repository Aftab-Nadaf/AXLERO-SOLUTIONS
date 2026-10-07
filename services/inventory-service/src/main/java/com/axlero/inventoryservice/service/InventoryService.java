package com.axlero.inventoryservice.service;
import com.axlero.inventoryservice.entity.Inventory;
import java.util.Optional;

public interface InventoryService {
    Inventory saveInventory(Inventory inventory);
    Optional<Inventory> getInventoryByProductId(Long productId);
}
