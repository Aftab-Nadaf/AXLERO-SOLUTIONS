package com.axlero.recommendationservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecommendationController {
	@GetMapping("/")
    public String test() {
        return "Recommendation Service is working";
    }
}



