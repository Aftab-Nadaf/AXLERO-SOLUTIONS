package Server.backend.recommendation.service;

import Server.backend.recommendation.dto.RecommendationResponse;
import Server.backend.recommendation.model.Recommendation;
import Server.backend.recommendation.repository.RecommendationRepository;
import Server.backend.recommendation.service.impl.RecommendationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceImplTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @InjectMocks
    private RecommendationServiceImpl recommendationService;

    @Test
    void shouldReturnRecommendationsByUserId() {

        Recommendation recommendation =
                new Recommendation(
                        1L,
                        501L,
                        101L,
                        "Laptop",
                        "Popular product"
                );

        when(recommendationRepository.findByUserId(501L))
                .thenReturn(List.of(recommendation));

        RecommendationResponse result =
                recommendationService.getRecommendationsByUserId(501L);

        assertNotNull(result);
        assertEquals(501L, result.getUserId());
        assertEquals(1, result.getRecommendations().size());
        assertEquals(101L,
                result.getRecommendations().get(0).getProductId());
        assertEquals("Laptop",
                result.getRecommendations().get(0).getName());

        verify(recommendationRepository).findByUserId(501L);
    }

    @Test
    void shouldReturnEmptyRecommendationsWhenUserHasNoRecommendations() {

        when(recommendationRepository.findByUserId(999L))
                .thenReturn(List.of());

        RecommendationResponse result =
                recommendationService.getRecommendationsByUserId(999L);

        assertNotNull(result);
        assertEquals(999L, result.getUserId());
        assertEquals(0, result.getRecommendations().size());

        verify(recommendationRepository).findByUserId(999L);
    }
}