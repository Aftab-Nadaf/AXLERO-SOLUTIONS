package com.axlero.recommendationservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.axlero.recommendationservice.dto.RecommendationResponse;
import com.axlero.recommendationservice.dto.RecommendedProduct;

@Service
public class RecommendationServiceImpl implements RecommendationService {

	@Override
	public RecommendationResponse getRecommendations(int userId) {

        List<RecommendedProduct> products = List.of(
            new RecommendedProduct(101, "Laptop"),
            new RecommendedProduct(102, "Wireless Mouse")
        );

        return new RecommendationResponse(userId, products);
    }
}
