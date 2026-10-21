package com.axlero.apigateway.dto;

import java.util.List;

public class RecommendationResponse {

    private int userId;
    private List<RecommendedProduct> recommendations;

    public RecommendationResponse(int userId,
                                  List<RecommendedProduct> recommendations) {
        this.userId = userId;
        this.recommendations = recommendations;
    }

    public int getUserId() {
        return userId;
    }

    public List<RecommendedProduct> getRecommendations() {
        return recommendations;
    }
}