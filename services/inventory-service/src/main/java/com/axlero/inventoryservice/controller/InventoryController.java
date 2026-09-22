package com.axlero.inventoryservice.controller;

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
}


