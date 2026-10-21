package com.axlero.apigateway.config;

import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.stripPrefix;
import static org.springframework.cloud.gateway.server.mvc.filter.CircuitBreakerFilterFunctions.circuitBreaker;
import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.web.servlet.function.RequestPredicates.path;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import static org.springframework.cloud.gateway.server.mvc.filter.RetryFilterFunctions.retry;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

@Configuration
public class RecommendationGatewayConfig {

    @Bean
    public RouterFunction<ServerResponse> recommendationRoute() {

        return route("recommendation-service")
                .route(
                        path("/api/recommendations/{*segments}"),
                        http()
                )
                .before(stripPrefix(1))

                .filter(
                	    retry(config -> config
                	        .setRetries(2)
                	        .setSeries(Set.of(HttpStatus.Series.SERVER_ERROR))
                	        .setMethods(Set.of(HttpMethod.GET))
                	        .setExceptions(Set.of(Exception.class))
                	    )
                	)
                	.filter(
                	    circuitBreaker(
                	        config -> config
                	            .setId("recommendationCircuitBreaker")
                	            .setFallbackUri("forward:/fallback/recommendations")
                	            .setStatusCodes("503")
                	    )
                	)
                	.filter(lb("RECOMMENDATION-SERVICE"))

                .build();
    }
}