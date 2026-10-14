package com.axlero.apigateway.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ZipkinTraceController {

    private final RestClient restClient;
    private final String zipkinQueryUrl;

    public ZipkinTraceController(
            RestClient.Builder restClientBuilder,
            @Value("${app.zipkin.query-url}") String zipkinQueryUrl) {
        this.restClient = restClientBuilder.build();
        this.zipkinQueryUrl = zipkinQueryUrl;
    }

    @GetMapping("/api/traces")
    public JsonNode getRecentTraces(@RequestParam(defaultValue = "10") int limit) {
        if (limit < 1 || limit > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trace limit must be between 1 and 100.");
        }

        try {
            return restClient.get()
                    .uri(zipkinQueryUrl + "?limit={limit}", limit)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The Zipkin trace collector is unavailable.",
                    exception);
        }
    }
}
