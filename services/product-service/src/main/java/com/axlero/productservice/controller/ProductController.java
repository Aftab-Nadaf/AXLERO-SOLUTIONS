package com.axlero.productservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axlero.productservice.dto.ProductResponse;
import com.axlero.productservice.service.PoductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final PoductService productService;
	

    public ProductController(PoductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{productId}")
    public ProductResponse getProductById(@PathVariable int productId) {
        return productService.getProductById(productId);
    }
}