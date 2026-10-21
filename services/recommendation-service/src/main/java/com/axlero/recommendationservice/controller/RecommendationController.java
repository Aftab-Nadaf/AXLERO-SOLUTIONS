package com.axlero.recommendationservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axlero.recommendationservice.dto.RecommendationResponse;
import com.axlero.recommendationservice.service.RecommendationService;


//API -- GET /api/recommendations/{userId}

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {
	
	private final  RecommendationService recommendationservice;
	
	public RecommendationController(RecommendationService recommendationservice) {
		this.recommendationservice = recommendationservice;
	}

	@GetMapping("/{userId}")
	 public RecommendationResponse getRecommendations(@PathVariable int userId) {
        return recommendationservice.getRecommendations(userId);
    }
}



