
package com.axlero.apigateway.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreaker.Metrics;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/monitoring")
@Slf4j
public class CircuitBreakerMonitoringController {

    private final CircuitBreakerRegistry circuitBreakerRegistry;

    public CircuitBreakerMonitoringController(
            CircuitBreakerRegistry circuitBreakerRegistry) {
        this.circuitBreakerRegistry = circuitBreakerRegistry;
    }

    @GetMapping("/circuit-breaker")
    public Map<String, String> getCircuitBreakerState() {

        CircuitBreaker circuitBreaker =
                circuitBreakerRegistry.circuitBreaker(
                        "recommendationCircuitBreaker");

        return Map.of(
                "name", circuitBreaker.getName(),
                "state", circuitBreaker.getState().name()
        );
    }
    
//    This endpoint reads the metrics directly from the configured Resilience4j circuit breaker

	@GetMapping("/circuit-breaker/metrics")
	public Map<String, Object> getCircuitBreakerMetrics() {
		log.info("Fetching circuit breaker metrics");
	    CircuitBreaker circuitBreaker =
	            circuitBreakerRegistry.circuitBreaker(
	                    "recommendationCircuitBreaker");
	
	    Metrics metrics = circuitBreaker.getMetrics();
	
	    Map<String, Object> response = new LinkedHashMap<>();
	    response.put("name", circuitBreaker.getName());
	    response.put("state", circuitBreaker.getState().name());
	    response.put("failureRate", metrics.getFailureRate());
	    response.put("slowCallRate", metrics.getSlowCallRate());
	    response.put("numberOfSuccessfulCalls",
	            metrics.getNumberOfSuccessfulCalls());
	    response.put("numberOfFailedCalls",
	            metrics.getNumberOfFailedCalls());
	    response.put("numberOfSlowCalls",
	            metrics.getNumberOfSlowCalls());
	    response.put("numberOfBufferedCalls",
	            metrics.getNumberOfBufferedCalls());
	
	    return response;
	}

}

