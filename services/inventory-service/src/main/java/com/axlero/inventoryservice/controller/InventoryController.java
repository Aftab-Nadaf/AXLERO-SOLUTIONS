package com.axlero.inventoryservice.controller;

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

}


