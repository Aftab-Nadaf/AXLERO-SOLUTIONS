package com.axlero.productservice.service;
<<<<<<< HEAD
import com.axlero.productservice.entity.Product;
import com.axlero.productservice.repository.ProductRepository;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service 
public class ProductServiceImpl implements ProductService {
    @Autowired 
    private ProductRepository productRepository;
    @Override 
    public Product saveProduct(Product product){
        return productRepository.save(product);
    }
    @Override 
    public List<Product>fetchProductList(){
        return(List<Product>) productRepository.findAll();
    }
    @Override
    public Product fetchProductByProductId(Long productId) {
        return productRepository.findByProductId(productId).get();
    }

    
}
=======

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
>>>>>>> 974167375ba18699e9e01bb6b0fc96b5f0f0987f
