package com.axlero.apigateway.dto;

public class RecommendedProduct {

    private int productId;
    private String name;

    public RecommendedProduct(int productId, String name) {
        this.productId = productId;
        this.name = name;
    }

    public int getProductId() {
        return productId;
    }

    public String getName() {
        return name;
    }
}