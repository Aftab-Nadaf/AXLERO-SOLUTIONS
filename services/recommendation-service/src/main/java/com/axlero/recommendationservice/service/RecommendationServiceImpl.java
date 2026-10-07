package com.axlero.recommendationservice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.axlero.recommendationservice.Entity.Recommendation;
import com.axlero.recommendationservice.Entity.RecommendationObj;
import com.axlero.recommendationservice.repository.RecommendationObjRepository;
import com.axlero.recommendationservice.repository.RecommendationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    private Recommendation recommendation;
    private RecommendationObj recommendationObj;
    private final RecommendationRepository recommendationRepository;
    private final RecommendationObjRepository recommendationObjRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public RecommendationServiceImpl(RecommendationRepository recommendationRepository,
                                    RecommendationObjRepository recommendationObjRepository) {
        this.recommendationRepository = recommendationRepository;
        this.recommendationObjRepository = recommendationObjRepository;
        this.recommendation = new Recommendation();
        this.recommendationObj = new RecommendationObj();
    }

    @Override
    public String GetData() {
        Map<String, Object> responseMap = new HashMap<>();
        List<Long> userIds = recommendationRepository.findDistinctUserIds();

        for (Long userId : userIds) {
            List<Object[]> recommendations = recommendationObjRepository.findProductsByUserId(userId);
            responseMap.put("userId", userId);
            responseMap.put("recommendations", recommendations);
        }

        try {
            return mapper.writeValueAsString(responseMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize recommendation data", e);
        }
    }
    
    @Override
    public void ExtractData(String data) {
        List<RecommendationObj> dbList = new ArrayList<>();
        RecommendationObj product = new RecommendationObj();
        try {
            recommendation.setId(0L);
            recommendationObj.setId(0L);
            JsonNode jsonData = mapper.readTree(data);
            JsonNode userIdNode = jsonData.get("userId");
            JsonNode remainData = jsonData.path("recommendations");

            Long userId = userIdNode.asLong();
            recommendation.setUserId(userId);
            recommendationRepository.save(recommendation);

            if (remainData.isArray()) {
                for (JsonNode node : remainData) {
                    
                    product.setUserId(userId);
                    product.setProductId(node.path("productId").asLong());
                    product.setName(node.path("name").asText());
                    dbList.add(product);
                }
                recommendationObjRepository.saveAll(dbList);
            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse recommendation payload", e);
        }
    }
}
