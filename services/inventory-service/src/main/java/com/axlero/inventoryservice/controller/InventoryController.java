package com.axlero.inventoryservice.controller;

<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.axlero.inventoryservice.entity.Inventory;
import com.axlero.inventoryservice.service.InventoryService;
import org.springframework.web.bind.annotation.PathVariable;

import jakarta.validation.Valid;
@RestController
@RequestMapping ("api/inventory")
public class InventoryController {
	@Autowired 
	private InventoryService inventoryService;

	@GetMapping("/{id}")
	public Inventory getInventoryByProductId(@PathVariable("id") Long productId) {
		return inventoryService.getInventoryByProductId(productId)
				.orElseThrow(() -> new RuntimeException("Inventory not found for product ID: " + productId));
	}

	@PostMapping("/upload")
	public Inventory createInventory(@Valid @RequestBody Inventory inventory) {
		inventory.setId(0);
		return inventoryService.saveInventory(inventory);
		
	}

=======
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axlero.inventoryservice.dto.InventoryResponse;
import com.axlero.inventoryservice.service.InventoryService;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
	
	private final InventoryService  inventoryService;
	
	public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }
	
	@GetMapping("/{productId}")
	public InventoryResponse getInventoryByProductId(@PathVariable int productId) {
		
		return inventoryService.getInventoryByProductId(productId);
	}
>>>>>>> 974167375ba18699e9e01bb6b0fc96b5f0f0987f
}


