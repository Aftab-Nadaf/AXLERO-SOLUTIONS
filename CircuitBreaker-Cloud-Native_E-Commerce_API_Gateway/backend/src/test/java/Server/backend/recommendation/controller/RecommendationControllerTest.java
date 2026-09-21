package Server.backend.recommendation.controller;

import Server.backend.recommendation.exception.RecommendationNotFoundException;
import Server.backend.recommendation.model.Recommendation;
import Server.backend.recommendation.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecommendationController.class)
class RecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RecommendationService recommendationService;

    @Test
    void shouldGetAllRecommendations() throws Exception {

        Recommendation recommendation =
                new Recommendation(1L, 1L, 101L, "Popular product");

        when(recommendationService.getAllRecommendations())
                .thenReturn(List.of(recommendation));

        mockMvc.perform(get("/api/recommendations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].productId").value(101))
                .andExpect(jsonPath("$[0].reason").value("Popular product"));
    }

    @Test
    void shouldCreateRecommendation() throws Exception {

        Recommendation recommendation =
                new Recommendation(1L, 1L, 101L, "Popular product");

        when(recommendationService.createRecommendation(any(Recommendation.class)))
                .thenReturn(recommendation);

        mockMvc.perform(post("/api/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "userId": 1,
                                    "productId": 101,
                                    "reason": "Popular product"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.productId").value(101))
                .andExpect(jsonPath("$.reason").value("Popular product"));
    }

    @Test
    void shouldGetRecommendationById() throws Exception {

        Recommendation recommendation =
                new Recommendation(1L, 1L, 101L, "Popular product");

        when(recommendationService.getRecommendationById(1L))
                .thenReturn(recommendation);

        mockMvc.perform(get("/api/recommendations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.productId").value(101))
                .andExpect(jsonPath("$.reason").value("Popular product"));
    }

    @Test
    void shouldDeleteRecommendation() throws Exception {

        doNothing().when(recommendationService).deleteRecommendation(1L);

        mockMvc.perform(delete("/api/recommendations/1"))
                .andExpect(status().isOk());

        verify(recommendationService).deleteRecommendation(1L);
    }

    @Test
    void shouldRejectInvalidRecommendation() throws Exception {

        mockMvc.perform(post("/api/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "userId": null,
                                    "productId": 101,
                                    "reason": ""
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnNotFoundWhenRecommendationDoesNotExist() throws Exception {

        when(recommendationService.getRecommendationById(999L))
                .thenThrow(new RecommendationNotFoundException(
                        "Recommendation not found with id: 999"));

        mockMvc.perform(get("/api/recommendations/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string(
                        "Recommendation not found with id: 999"));
    }
}