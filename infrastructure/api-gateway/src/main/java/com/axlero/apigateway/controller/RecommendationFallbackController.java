package com.axlero.apigateway.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axlero.apigateway.dto.RecommendationResponse;
import com.axlero.apigateway.dto.RecommendedProduct;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class RecommendationFallbackController {

    @GetMapping("/fallback/recommendations")
    public RecommendationResponse recommendationFallback(
            HttpServletRequest request) {
    	
    	log.warn(
    		    "Fallback diagnostic: method={}, requestURI={}, dispatcherType={}",
    		    request.getMethod(),
    		    request.getRequestURI(),
    		    request.getDispatcherType()
    		);

        // Log incoming request details to help tracing
        log.info("Fallback endpoint invoked: method={}, requestURI={}, query={}",
                request.getMethod(), request.getRequestURI(), request.getQueryString());

        String originalUri = (String) request.getAttribute("jakarta.servlet.forward.request_uri");
        if (originalUri == null) {
            originalUri = request.getRequestURI();
        }
        log.debug("Resolved originalUri={}", originalUri);

        String[] parts = originalUri.split("/");
        int userId;
        try {
            userId = Integer.parseInt(parts[parts.length - 1]);
        } catch (NumberFormatException | ArrayIndexOutOfBoundsException ex) {
            // Log the parsing problem and fall back to a sentinel user id
            log.warn("Unable to parse userId from URI='{}'. Falling back to userId=-1", originalUri, ex);
            userId = -1;
        }
        log.debug("Parsed userId={}", userId);

        List<RecommendedProduct> products = List.of(
                new RecommendedProduct(201, "Top Seller - Smartphone"),
                new RecommendedProduct(202, "Top Seller - Headphones")
        );

        log.info("Returning fallback recommendations: userId={}, products={}", userId, products);

        return new RecommendationResponse(userId, products);
    }
}