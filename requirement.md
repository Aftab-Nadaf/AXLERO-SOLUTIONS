# Circuit Breaker Microservices — Project Requirements

## 1. Project Overview

The Circuit Breaker Microservices project demonstrates fault tolerance in a Spring Boot microservices architecture. It prevents repeated calls to an unhealthy Recommendation Service and returns a fallback response while the service is unavailable or slow.

The project also provides a monitoring dashboard to visualize circuit breaker state, service health, and performance metrics.

## 2. Objectives

- Demonstrate the Closed, Open, and Half-Open circuit breaker states.
- Handle Recommendation Service failures and slow responses.
- Return a fallback response when recommendation requests fail.
- Discover microservices through Netflix Eureka.
- Monitor circuit breaker metrics using Resilience4j, Spring Boot Actuator, Prometheus, and Grafana.
- Display service health and circuit breaker information in a web dashboard.
- Simulate failures and latency for controlled demonstrations.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Backend | Java 21, Spring Boot |
| API Gateway | Spring Cloud Gateway Server WebMVC |
| Fault tolerance | Resilience4j |
| Service discovery | Netflix Eureka |
| Monitoring | Spring Boot Actuator, Prometheus, Grafana |
| Distributed tracing | Zipkin |
| Frontend | React, Vite |
| Build tools | Maven, npm |
| Testing | Postman, k6 |

## 4. System Components

### 4.1 Eureka Server

- Runs on port 8761.
- Registers and discovers backend services.
- Allows the gateway to locate the Recommendation Service.

### 4.2 API Gateway

- Runs on port 8083.
- Routes client requests to the appropriate backend service.
- Applies the Recommendation Service circuit breaker.
- Returns the configured fallback response when the circuit breaker handles a failed request.
- Exposes monitoring APIs for circuit breaker state and metrics.

### 4.3 Product Service

- Runs on port 8080.
- Provides product-related functionality.
- Exposes an Actuator health endpoint.

### 4.4 Inventory Service

- Runs on port 8081.
- Provides inventory-related functionality.
- Exposes an Actuator health endpoint.

### 4.5 Recommendation Service

- Runs on port 8082.
- Provides recommendations for a user.
- Supports controlled failure and latency simulation for demonstrations.
- Exposes an Actuator health endpoint.

### 4.6 Monitoring Dashboard

- Runs on port 5173 during frontend development.
- Displays service health, circuit breaker state, and performance metrics.
- Provides controls to enable or disable simulated failures and latency.

### 4.7 Monitoring and Tracing

- Prometheus runs on port 9090 and collects metrics.
- Grafana runs on port 3000 and visualizes metrics.
- Zipkin runs on port 9411 for distributed tracing.

## 5. Circuit Breaker Requirements

The circuit breaker protects requests routed to the Recommendation Service.

### 5.1 Closed State

- Requests are forwarded to the Recommendation Service.
- Calls are recorded by Resilience4j.
- The circuit remains closed while the configured failure threshold is not exceeded.

### 5.2 Open State

- When the configured failure threshold is exceeded, the circuit opens.
- Requests are prevented from repeatedly calling the failing service.
- The gateway returns the configured fallback response.

### 5.3 Half-Open State

- After the configured open-state wait duration, the circuit transitions to Half-Open.
- A limited number of test calls are permitted.
- Successful test calls allow the circuit to close.
- Continued failures cause the circuit to reopen.

### 5.4 Initial Circuit Breaker Configuration

| Property | Value |
|---|---|
| Sliding window type | Count-based |
| Sliding window size | 5 calls |
| Minimum calls | 5 |
| Failure rate threshold | 50% |
| Open-state wait duration | 10 seconds |
| Permitted Half-Open calls | 2 |
| Automatic Open-to-Half-Open transition | Enabled |
| Recommendation TimeLimiter | 5 seconds |

These values describe the current intended configuration and should be kept synchronized with the gateway configuration.

## 6. API Contracts

### 6.1 Recommendation API

**Get recommendations**

- Method: `GET`
- Gateway endpoint: `/api/recommendations/{userId}`
- Direct service endpoint: `/recommendations/{userId}`
- Example user ID: `105`

The successful response contains the user ID and a list of recommendations. The exact JSON fields must match the implementation.

### 6.2 Failure Simulation APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/recommendations/admin/failure/enable` | Enable simulated failures |
| POST | `/recommendations/admin/failure/disable` | Disable simulated failures |

### 6.3 Latency Simulation APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/recommendations/admin/latency/enable` | Enable simulated latency |
| POST | `/recommendations/admin/latency/disable` | Disable simulated latency |

### 6.4 Gateway Monitoring APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/monitoring/circuit-breaker` | Read circuit breaker name and state |
| GET | `/api/monitoring/circuit-breaker/metrics` | Read circuit breaker metrics |

### 6.5 Health APIs

Each backend service exposes:

`GET /actuator/health`

The dashboard checks Product, Inventory, and Recommendation Service health through the configured frontend development proxies.

### 6.6 Fallback Endpoint

- Internal gateway fallback route: `/fallback/recommendations`
- The gateway forwards handled failures to this endpoint.
- The fallback returns the configured fallback recommendation response.

## 7. Monitoring Requirements

The monitoring solution should provide:

- Circuit breaker state: CLOSED, OPEN, or HALF_OPEN.
- Failure rate and slow-call rate, when available.
- Successful and failed circuit breaker call counts.
- Buffered calls, where supported by the configured Resilience4j version.
- Service health: UP or DOWN.
- Request rate, latency, and HTTP 5xx error rate through Prometheus.
- A visual dashboard for reviewing the above information.

Circuit breaker failed calls and HTTP 5xx responses are different measurements. A fallback can return HTTP 200 even when the original downstream call fails.

## 8. Functional Acceptance Criteria

1. The application starts with the required services registered in Eureka.
2. The dashboard can retrieve service health and monitoring data.
3. A normal recommendation request returns a successful response.
4. Enabling failure simulation produces the configured downstream failure.
5. Repeated qualifying failures cause the circuit breaker to open.
6. Requests handled while the circuit is open receive the fallback response.
7. After the wait duration, the circuit permits Half-Open test calls.
8. Disabling failure simulation allows the Recommendation Service to recover.
9. Successful recovery calls allow the circuit breaker to close.
10. Latency simulation can be enabled and disabled through the dashboard.
11. Prometheus exposes circuit breaker and application metrics.
12. The React production build completes successfully.

## 9. Non-Functional Requirements

- The gateway should protect the Recommendation Service from repeated failing calls.
- Fallback behavior should be predictable and observable.
- Monitoring data should reflect the configured metrics and their actual meanings.
- Logs should help diagnose gateway routing, fallback invocation, and simulated failures.
- Configuration should be maintained in the appropriate application YAML files.
- Simulated failure and latency controls are for development and demonstration, not unrestricted production use.

## 10. Scope Boundaries

The primary demonstration focuses on the Recommendation Service circuit breaker. Product and Inventory Services provide service-health information and their existing routed functionality.

Additional retry policies, authentication, production deployment, and other resilience mechanisms should only be considered when they are explicitly part of the project implementation or agreed requirements.

## 11. Project Completion

The project is ready for demonstration when the normal request, failure simulation, fallback, circuit state transitions, recovery, dashboard monitoring, and production frontend build have been verified.
