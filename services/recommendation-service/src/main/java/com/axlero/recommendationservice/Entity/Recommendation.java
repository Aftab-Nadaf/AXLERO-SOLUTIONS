package com.axlero.recommendationservice.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Column;


@Entity 
@Table (name = "recommendations")
@Getter 
@Setter 
@Builder 
@AllArgsConstructor
@NoArgsConstructor
public class Recommendation {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column (name="user_id", nullable = false)
    private Long userId;
    
}
