package com.axlero.inventoryservice.service;

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
}
