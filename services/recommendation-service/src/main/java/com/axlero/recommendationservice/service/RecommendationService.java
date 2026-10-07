package com.axlero.recommendationservice.service;

<<<<<<< HEAD
public interface RecommendationService {
   
   String GetData();
   void ExtractData(String Data);
   
   
}
=======
import com.axlero.recommendationservice.dto.RecommendationResponse;

public interface RecommendationService {
	public RecommendationResponse getRecommendations(int userId);
}
>>>>>>> 974167375ba18699e9e01bb6b0fc96b5f0f0987f
