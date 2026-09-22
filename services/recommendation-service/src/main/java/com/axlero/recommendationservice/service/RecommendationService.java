package com.axlero.recommendationservice.service;

import com.axlero.recommendationservice.dto.RecommendationResponse;

public interface RecommendationService {
	public RecommendationResponse getRecommendations(int userId);
}
