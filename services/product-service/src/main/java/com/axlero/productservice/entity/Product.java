package com.axlero.productservice.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@NoArgsConstructor                  // Required by JPA for entity initialization
@AllArgsConstructor                 // Useful for @Builder
@Getter                             // Generates getters for all fields
@Setter                             // Generates setters for mutable fields
@Builder          
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Builder.Default
    private long id = 0;
    @Column(name = "product_id")
    private Long productId;
    @Column(name = "product_name")
    private String name;
    @Column(name = "product_description")
    private String description;
    @Column(name = "product_price")
    private Long price;
    @Column(name = "product_category")
    private String category;
}
    

    
    
