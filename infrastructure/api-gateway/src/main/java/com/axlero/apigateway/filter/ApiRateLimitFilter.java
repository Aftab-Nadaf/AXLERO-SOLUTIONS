package com.axlero.apigateway.filter;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class ApiRateLimitFilter extends OncePerRequestFilter {

    @Value("${app.rate-limit.capacity:100}")
    private int capacity;

    @Value("${app.rate-limit.window-seconds:60}")
    private long windowSeconds;

    private final ConcurrentHashMap<String, ClientWindow> clients =
            new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Apply rate limiting only to API requests.
        if (!path.startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = request.getRemoteAddr();
        long windowMillis = windowSeconds * 1000L;
        long currentWindow = System.currentTimeMillis() / windowMillis;

        ClientWindow clientWindow = clients.compute(clientIp,
                (ip, existing) -> {
                    if (existing == null
                            || existing.windowId != currentWindow) {
                        return new ClientWindow(currentWindow);
                    }
                    return existing;
                });

        int requestCount = clientWindow.count.incrementAndGet();

        response.setHeader("X-RateLimit-Limit",
                String.valueOf(capacity));
        response.setHeader("X-RateLimit-Remaining",
                String.valueOf(Math.max(0, capacity - requestCount)));

        if (requestCount > capacity) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            response.getWriter().write(
                    "{\"status\":429,"
                    + "\"message\":\"Too many requests\","
                    + "\"timestamp\":\"" + Instant.now() + "\"}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private static class ClientWindow {
        private final long windowId;
        private final AtomicInteger count = new AtomicInteger(0);

        private ClientWindow(long windowId) {
            this.windowId = windowId;
        }
    }
}