package com.axlero.recommendationservice.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.axlero.recommendationservice.Entity.Recommendation;

@Repository 
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query("SELECT DISTINCT r.userId from Recommendation r")
    List<Long>findDistinctUserIds();
        
    
}

