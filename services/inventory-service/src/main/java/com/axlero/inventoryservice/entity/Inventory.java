package com.axlero.inventoryservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table (name ="inventory")
@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter 
@Builder 
public class Inventory {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Builder.Default
    private long id = 0;
    @Column(name = "product_id")
    private Long productId;
    @Column(name = "availableQuantity")
    private Integer availableQuantity;
    @Column (name = "reservedQuantity")
    private Integer reservedQuantity;
    @Column (name="status")
    private String status;

}
