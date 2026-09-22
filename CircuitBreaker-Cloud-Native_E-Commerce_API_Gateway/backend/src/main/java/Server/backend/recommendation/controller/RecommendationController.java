package Server.backend.recommendation.controller;

import Server.backend.recommendation.dto.RecommendationResponse;
import Server.backend.recommendation.service.RecommendationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/{userId}")
    public RecommendationResponse getRecommendationsByUserId(
            @PathVariable Long userId) {

        return recommendationService.getRecommendationsByUserId(userId);
    }

    @GetMapping("/test/failure")
    public String simulateFailure() {
        throw new RuntimeException("Recommendation Service failure simulated");
    }
}