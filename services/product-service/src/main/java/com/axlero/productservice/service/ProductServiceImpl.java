package com.axlero.productservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.axlero.productservice.dto.ProductResponse;

@Service
public class ProductServiceImpl implements PoductService {
    public List<ProductResponse> getAllProducts() {

        return List.of(
            new ProductResponse(
                101,
                "Laptop",
                "Dell Laptop",
                65000,
                "Electronics"
            ),
            new ProductResponse(
                102,
                "Wireless Mouse",
                "Bluetooth Mouse",
                1200,
                "Accessories"
            )
        );
    }

    public ProductResponse getProductById(int productId) {

        return new ProductResponse(
            productId,
            "Laptop",
            "Dell Laptop",
            65000,
            "Electronics"
        );
    }
}
