package Server.backend.recommendation.exception;

public class RecommendationNotFoundException extends RuntimeException {

    public RecommendationNotFoundException(String message) {
        super(message);
    }
}