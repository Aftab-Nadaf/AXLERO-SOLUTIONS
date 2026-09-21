package Server.backend.recommendation.controller;

import Server.backend.recommendation.model.Recommendation;
import Server.backend.recommendation.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public List<Recommendation> getRecommendations() {
        return recommendationService.getAllRecommendations();
    }

    @PostMapping
    public Recommendation createRecommendation(@Valid @RequestBody Recommendation recommendation) {
        return recommendationService.createRecommendation(recommendation);
    }

    @GetMapping("/{id}")
    public Recommendation getRecommendationById(@PathVariable Long id) {
        return recommendationService.getRecommendationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRecommendation(@PathVariable Long id) {
        recommendationService.deleteRecommendation(id);
    }

    @GetMapping("/test/failure")
    public String simulateFailure() {
        throw new RuntimeException("Recommendation Service failure simulated");
    }
}