package com.axlero.productservice.service;
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