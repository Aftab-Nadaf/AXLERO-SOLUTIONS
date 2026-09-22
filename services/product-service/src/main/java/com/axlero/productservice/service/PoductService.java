package com.axlero.productservice.service;

import java.util.List;

import com.axlero.productservice.dto.ProductResponse;

public interface PoductService {
	public List<ProductResponse> getAllProducts();
	 public ProductResponse getProductById(int productId);
}
