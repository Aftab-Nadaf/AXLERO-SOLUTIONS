package com.axlero.recommendationservice.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GeneratedValue;  
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;


@Entity
@Table (name = "recommendationObj")
@Getter 
@Setter 
@Builder 
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationObj {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    @Column (name="product_id", nullable = false)
    private Long productId;
    @Column (name="user_id", nullable = false)
    private Long userId;
    @Column (name="name")
    private String name;

        
}
