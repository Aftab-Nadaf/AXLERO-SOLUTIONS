package Server.backend.recommendation.service.impl;

import Server.backend.recommendation.dto.RecommendationItem;
import Server.backend.recommendation.dto.RecommendationResponse;
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
    public RecommendationResponse getRecommendationsByUserId(Long userId) {

        List<Recommendation> recommendations =
                recommendationRepository.findByUserId(userId);

        List<RecommendationItem> items = recommendations.stream()
                .map(recommendation ->
                        new RecommendationItem(
                                recommendation.getProductId(),
                                recommendation.getName()
                        ))
                .toList();

        return new RecommendationResponse(userId, items);
    }
}