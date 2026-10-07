package com.axlero.recommendationservice.repository;
import com.axlero.recommendationservice.Entity.RecommendationObj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import java.util.List;
@Repository 
public interface RecommendationObjRepository extends JpaRepository<RecommendationObj, Long> {

    @Query("SELECT r.productId, r.name FROM RecommendationObj r WHERE r.userId = :userId")
    List<Object[]> findProductsByUserId(@Param("userId") Long userId);
        
}
