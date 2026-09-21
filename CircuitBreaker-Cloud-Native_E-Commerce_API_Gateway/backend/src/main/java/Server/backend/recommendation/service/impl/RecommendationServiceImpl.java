package Server.backend.recommendation.service.impl;

import Server.backend.recommendation.exception.RecommendationNotFoundException;
import Server.backend.recommendation.model.Recommendation;
import Server.backend.recommendation.repository.RecommendationRepository;
import Server.backend.recommendation.service.RecommendationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public RecommendationServiceImpl(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    @Override
    public List<Recommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }

    @Override
    public Recommendation createRecommendation(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }

    @Override
    public Recommendation getRecommendationById(Long id) {
        return recommendationRepository.findById(id)
                .orElseThrow(() ->
                        new RecommendationNotFoundException("Recommendation not found with id: " + id));
    }

    @Override
    public void deleteRecommendation(Long id) {
        recommendationRepository.deleteById(id);
    }
}