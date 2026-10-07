package com.axlero.productservice.service;
import com.axlero.productservice.entity.Product;
import java.util.List;

public interface ProductService {
    Product saveProduct(Product product);
    List<Product>fetchProductList();
    Product fetchProductByProductId(Long productId);

}
