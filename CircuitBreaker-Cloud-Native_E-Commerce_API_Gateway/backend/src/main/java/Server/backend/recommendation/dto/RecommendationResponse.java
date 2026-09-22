package Server.backend.recommendation.dto;

import java.util.List;

public class RecommendationResponse {

    private Long userId;
    private List<RecommendationItem> recommendations;

    public RecommendationResponse() {
    }

    public RecommendationResponse(Long userId, List<RecommendationItem> recommendations) {
        this.userId = userId;
        this.recommendations = recommendations;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<RecommendationItem> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationItem> recommendations) {
        this.recommendations = recommendations;
    }
}