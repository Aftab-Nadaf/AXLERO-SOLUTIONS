package com.axlero.inventoryservice.service;
<<<<<<< HEAD
import com.axlero.inventoryservice.entity.Inventory;
import com.axlero.inventoryservice.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

@Service
public class InventoryServiceImpl implements InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Override
    public Optional<Inventory> getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId);
    }
=======

import org.springframework.stereotype.Service;

import com.axlero.inventoryservice.dto.InventoryResponse;

@Service
public class InventoryServiceImpl implements InventoryService {

	@Override
	public InventoryResponse getInventoryByProductId(int productId) {
		
		 return new InventoryResponse(
		            productId,
		            25,
		            5,
		            "IN_STOCK"
		        );
	}
>>>>>>> 974167375ba18699e9e01bb6b0fc96b5f0f0987f
}
