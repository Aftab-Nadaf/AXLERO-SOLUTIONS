package Server.backend.recommendation.controller;

import Server.backend.recommendation.dto.RecommendationItem;
import Server.backend.recommendation.dto.RecommendationResponse;
import Server.backend.recommendation.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RecommendationController.class)
class RecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RecommendationService recommendationService;

    @Test
    void shouldGetRecommendationsByUserId() throws Exception {

        RecommendationResponse response =
                new RecommendationResponse(
                        501L,
                        List.of(
                                new RecommendationItem(101L, "Laptop"),
                                new RecommendationItem(102L, "Wireless Mouse")
                        )
                );

        when(recommendationService.getRecommendationsByUserId(501L))
                .thenReturn(response);

        mockMvc.perform(get("/api/recommendations/501"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(501))
                .andExpect(jsonPath("$.recommendations[0].productId").value(101))
                .andExpect(jsonPath("$.recommendations[0].name").value("Laptop"))
                .andExpect(jsonPath("$.recommendations[1].productId").value(102))
                .andExpect(jsonPath("$.recommendations[1].name").value("Wireless Mouse"));
    }

    @Test
    void shouldReturnEmptyRecommendationsWhenUserHasNoRecommendations()
            throws Exception {

        RecommendationResponse response =
                new RecommendationResponse(
                        999L,
                        List.of()
                );

        when(recommendationService.getRecommendationsByUserId(999L))
                .thenReturn(response);

        mockMvc.perform(get("/api/recommendations/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(999))
                .andExpect(jsonPath("$.recommendations").isEmpty());
    }

    @Test
    void shouldSimulateFailure() throws Exception {

        mockMvc.perform(get("/api/recommendations/test/failure"))
                .andExpect(status().isInternalServerError());
    }
}