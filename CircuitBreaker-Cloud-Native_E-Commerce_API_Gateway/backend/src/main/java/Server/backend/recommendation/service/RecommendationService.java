package Server.backend.recommendation.service;

import Server.backend.recommendation.model.Recommendation;

import java.util.List;

public interface RecommendationService {

    List<Recommendation> getAllRecommendations();

    Recommendation createRecommendation(Recommendation recommendation);

    Recommendation getRecommendationById(Long id);

    void deleteRecommendation(Long id);
}