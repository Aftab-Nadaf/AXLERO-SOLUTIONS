package Server.backend.recommendation.service;

import Server.backend.recommendation.exception.RecommendationNotFoundException;
import Server.backend.recommendation.model.Recommendation;
import Server.backend.recommendation.repository.RecommendationRepository;
import Server.backend.recommendation.service.impl.RecommendationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceImplTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @InjectMocks
    private RecommendationServiceImpl recommendationService;

    @Test
    void shouldReturnAllRecommendations() {
        Recommendation recommendation =
                new Recommendation(1L, 1L, 101L, "Popular product");

        when(recommendationRepository.findAll())
                .thenReturn(List.of(recommendation));

        List<Recommendation> result =
                recommendationService.getAllRecommendations();

        assertEquals(1, result.size());
        assertEquals(101L, result.get(0).getProductId());

        verify(recommendationRepository).findAll();
    }

    @Test
    void shouldCreateRecommendation() {
        Recommendation recommendation =
                new Recommendation(null, 1L, 101L, "Popular product");

        Recommendation savedRecommendation =
                new Recommendation(1L, 1L, 101L, "Popular product");

        when(recommendationRepository.save(recommendation))
                .thenReturn(savedRecommendation);

        Recommendation result =
                recommendationService.createRecommendation(recommendation);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(101L, result.getProductId());

        verify(recommendationRepository).save(recommendation);
    }

    @Test
    void shouldReturnRecommendationById() {
        Recommendation recommendation =
                new Recommendation(1L, 1L, 101L, "Popular product");

        when(recommendationRepository.findById(1L))
                .thenReturn(Optional.of(recommendation));

        Recommendation result =
                recommendationService.getRecommendationById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(101L, result.getProductId());

        verify(recommendationRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenRecommendationNotFound() {
        when(recommendationRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                RecommendationNotFoundException.class,
                () -> recommendationService.getRecommendationById(999L)
        );

        verify(recommendationRepository).findById(999L);
    }

    @Test
    void shouldDeleteRecommendation() {
        recommendationService.deleteRecommendation(1L);

        verify(recommendationRepository).deleteById(1L);
    }
}