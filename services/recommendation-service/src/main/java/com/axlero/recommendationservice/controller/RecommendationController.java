package com.axlero.recommendationservice.controller;

<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.validation.Valid;

import com.axlero.recommendationservice.service.RecommendationService;

@RestController
public class RecommendationController {
    @Autowired
    private RecommendationService recommendationService;
    
	@GetMapping
    public String getRecommendation() {
        return recommendationService.GetData();
    }
    
    @PostMapping("/upload")
    public void createData(@Valid @RequestBody JsonNode payload){
        String Data = payload.toPrettyString();
        recommendationService.ExtractData(Data);
=======
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
>>>>>>> 974167375ba18699e9e01bb6b0fc96b5f0f0987f
    }
}



