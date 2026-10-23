
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

    //  flag for controlled failure testing
    private final AtomicBoolean failureEnabled = new AtomicBoolean(false);
    
    //  flag for controlled delay testing
    private final AtomicBoolean latencyEnabled = new AtomicBoolean(false);

    public RecommendationController(
            RecommendationService recommendationservice) {
        this.recommendationservice = recommendationservice;
    }

    @GetMapping("/{userId}")
    public RecommendationResponse getRecommendations(
            @PathVariable int userId) {

        log.info("Received recommendation request for userId={}", userId);
        
        if (latencyEnabled.get()) {
            long start = System.currentTimeMillis();

            log.warn("LATENCY TEST START: userId={}", userId);

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException(
                    "Recommendation request interrupted", e
                );
            }

            log.warn(
                "LATENCY TEST END: userId={}, elapsedMs={}",
                userId,
                System.currentTimeMillis() - start
            );
        }

        if (failureEnabled.get()) {
            log.error("Simulated failure enabled for userId={}", userId);
            throw new RuntimeException(
                    "Simulated Recommendation Service failure");
        }

        return recommendationservice.getRecommendations(userId);
    }

//  endpoints for controlled failure testing
    
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
    
//  endpoints for controlled delay testing
    
    @PostMapping("/admin/latency/enable")
    public String enableLatency() {
        latencyEnabled.set(true);
        log.warn("Simulated Recommendation Service latency ENABLED");
        return "Simulated latency enabled";
    }

    @PostMapping("/admin/latency/disable")
    public String disableLatency() {
        latencyEnabled.set(false);
        log.info("Simulated Recommendation Service latency DISABLED");
        return "Simulated latency disabled";
    }
}
