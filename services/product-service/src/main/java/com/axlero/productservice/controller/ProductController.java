package com.axlero.productservice.controller;

<<<<<<< HEAD
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

=======
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
>>>>>>> 974167375ba18699e9e01bb6b0fc96b5f0f0987f
}