package com.axlero.recommendationservice.controller;

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
    }
}



