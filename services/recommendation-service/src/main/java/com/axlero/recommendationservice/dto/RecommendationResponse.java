package com.axlero.recommendationservice.dto;

import java.util.List;

public class RecommendationResponse {
	 	private int userId;
	    private List<RecommendedProduct> recommendations;
		public RecommendationResponse(int userId, List<RecommendedProduct> recommendations) {
			super();
			this.userId = userId;
			this.recommendations = recommendations;
		}
		public int getUserId() {
			return userId;
		}
		public void setUserId(int userId) {
			this.userId = userId;
		}
		public List<RecommendedProduct> getRecommendations() {
			return recommendations;
		}
		public void setRecommendations(List<RecommendedProduct> recommendations) {
			this.recommendations = recommendations;
		}
		
		
	    
}
