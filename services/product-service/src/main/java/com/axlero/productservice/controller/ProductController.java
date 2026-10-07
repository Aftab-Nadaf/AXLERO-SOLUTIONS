package com.axlero.productservice.controller;

import com.axlero.productservice.entity.Product;
import com.axlero.productservice.service.ProductService;
import java.util.List;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/products") 
public class ProductController{
    @Autowired 
    private ProductService productService;

    @GetMapping
    public List<Product>fetchProductList(){
        return productService.fetchProductList();
    }

    @PostMapping("/upload")
    public Product saveProduct(@Valid @RequestBody Product product){
        product.setId(0);
        return productService.saveProduct(product);
    }
    @GetMapping ("/{Id}")
    public ResponseEntity<?> fetchProductByProductId(@PathVariable("Id") Long productId){
        Product findProduct =  productService.fetchProductByProductId(productId);
        if(findProduct == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        return ResponseEntity.ok(findProduct);
    }
    
   
    @GetMapping ("/error")
    public String handleError(){
        return "Error occurred while fetching product";
    }

}