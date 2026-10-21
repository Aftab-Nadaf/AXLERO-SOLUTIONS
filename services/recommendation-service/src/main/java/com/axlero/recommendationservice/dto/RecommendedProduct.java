package com.axlero.recommendationservice.dto;

public class RecommendedProduct {
	private int productId;
    private String name;
	public RecommendedProduct(int productId, String name) {
		super();
		this.productId = productId;
		this.name = name;
	}
	public int getProductId() {
		return productId;
	}
	public void setProductId(int productId) {
		this.productId = productId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
    
    
}
