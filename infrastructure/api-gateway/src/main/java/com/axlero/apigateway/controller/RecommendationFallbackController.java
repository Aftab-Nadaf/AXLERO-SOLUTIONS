package com.axlero.apigateway.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axlero.apigateway.dto.RecommendationResponse;
import com.axlero.apigateway.dto.RecommendedProduct;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class RecommendationFallbackController {

    @GetMapping("/fallback/recommendations")
    public RecommendationResponse recommendationFallback(
            HttpServletRequest request) {

        String originalUri =
                (String) request.getAttribute(
                        "jakarta.servlet.forward.request_uri");

        if (originalUri == null) {
            originalUri = request.getRequestURI();
        }

        String[] parts = originalUri.split("/");
        int userId = Integer.parseInt(parts[parts.length - 1]);

        List<RecommendedProduct> products = List.of(
                new RecommendedProduct(
                        201,
                        "Top Seller - Smartphone"
                ),
                new RecommendedProduct(
                        202,
                        "Top Seller - Headphones"
                )
        );

        return new RecommendationResponse(userId, products);
    }
}