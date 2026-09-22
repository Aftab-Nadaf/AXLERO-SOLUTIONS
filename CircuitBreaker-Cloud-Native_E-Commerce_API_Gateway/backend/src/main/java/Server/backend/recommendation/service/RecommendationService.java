package Server.backend.recommendation.service;

import Server.backend.recommendation.dto.RecommendationResponse;

public interface RecommendationService {

    RecommendationResponse getRecommendationsByUserId(Long userId);
}