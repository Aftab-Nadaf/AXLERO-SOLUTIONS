
package com.axlero.recommendationservice.controller;

import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axlero.recommendationservice.dto.RecommendationResponse;
import com.axlero.recommendationservice.service.RecommendationService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/recommendations")
@Slf4j
public class RecommendationController {

    private final RecommendationService recommendationservice;

    // Temporary flag for controlled failure testing
    private final AtomicBoolean failureEnabled = new AtomicBoolean(false);

    public RecommendationController(
            RecommendationService recommendationservice) {
        this.recommendationservice = recommendationservice;
    }

    @GetMapping("/{userId}")
    public RecommendationResponse getRecommendations(
            @PathVariable int userId) {

        log.info("Received recommendation request for userId={}", userId);

        if (failureEnabled.get()) {
            log.error("Simulated failure enabled for userId={}", userId);
            throw new RuntimeException(
                    "Simulated Recommendation Service failure");
        }

        return recommendationservice.getRecommendations(userId);
    }

    @PostMapping("/admin/failure/enable")
    public String enableFailure() {
        failureEnabled.set(true);
        log.warn("Simulated Recommendation Service failure ENABLED");
        return "Simulated failure enabled";
    }

    @PostMapping("/admin/failure/disable")
    public String disableFailure() {
        failureEnabled.set(false);
        log.info("Simulated Recommendation Service failure DISABLED");
        return "Simulated failure disabled";
    }
}
