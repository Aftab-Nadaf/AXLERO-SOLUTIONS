# Circuit Breaker Microservices

A Spring Boot microservices project demonstrating fault tolerance with Resilience4j Circuit Breaker, Spring Cloud Gateway, Netflix Eureka, and a React monitoring dashboard.

## Overview

When the Recommendation Service becomes slow or fails, the API Gateway protects it using a circuit breaker. When failures exceed the configured threshold, the circuit opens and the gateway returns a fallback response instead of repeatedly calling the unhealthy service.

After the configured wait duration, the circuit allows limited test calls. If the Recommendation Service recovers, the circuit closes and normal traffic resumes.

## Architecture

```text
                    React Monitoring Dashboard
                              |
                         API Gateway
                            :8083
                              |
                    Resilience4j Circuit Breaker
                              |
                         Eureka Server
                            :8761
                              |
                   Recommendation Service
                            :8082
                              |
                      Fallback Response

       Product Service :8080     Inventory Service :8081

       Prometheus :9090  ->  Grafana :3000
       Zipkin :9411      ->  Distributed Tracing
```

The circuit breaker demonstration primarily protects the Recommendation Service. Product and Inventory Services provide their existing functionality and health information.

## Technology Stack

- Java 21
- Spring Boot
- Spring Cloud Gateway Server WebMVC
- Resilience4j
- Netflix Eureka
- Spring Boot Actuator
- Prometheus and Grafana
- Zipkin
- React and Vite
- Maven and npm
- Postman and k6

## Service Ports

| Component | Port |
|---|---:|
| Product Service | 8080 |
| Inventory Service | 8081 |
| Recommendation Service | 8082 |
| API Gateway | 8083 |
| Eureka Server | 8761 |
| React Dashboard | 5173 |
| Prometheus | 9090 |
| Grafana | 3000 |
| Zipkin | 9411 |

## Prerequisites

- JDK 21
- Maven or the project's Maven Wrapper
- Node.js and npm
- Docker, if using the provided monitoring containers
- Git

Check your installed versions:

```bash
java -version
mvn -version
node -v
npm -v
```

## Running the Project

Start the services in this order:

1. Eureka Server
2. Product Service
3. Inventory Service
4. Recommendation Service
5. API Gateway
6. Prometheus, Grafana, and Zipkin, when configured
7. React Dashboard

Run each Spring Boot application from its actual module directory using its Maven Wrapper, where available:

```bash
./mvnw spring-boot:run
```

On Windows, use:

```bat
mvnw.cmd spring-boot:run
```

For the frontend, open a terminal in `circuit-breaker-ui`:

```bash
npm install
npm run dev
```

Open the dashboard at:

http://localhost:5173

The exact startup commands for Docker and monitoring components depend on the repository's current configuration.

## Important API Endpoints

### Recommendation API

Gateway request:

```http
GET http://localhost:8083/api/recommendations/105
```

Direct service request:

```http
GET http://localhost:8082/recommendations/105
```

### Failure Simulation

```http
POST http://localhost:8082/recommendations/admin/failure/enable
POST http://localhost:8082/recommendations/admin/failure/disable
```

### Latency Simulation

```http
POST http://localhost:8082/recommendations/admin/latency/enable
POST http://localhost:8082/recommendations/admin/latency/disable
```

### Circuit Breaker Monitoring

```http
GET http://localhost:8083/api/monitoring/circuit-breaker
GET http://localhost:8083/api/monitoring/circuit-breaker/metrics
```

### Service Health

```http
GET http://localhost:8080/actuator/health
GET http://localhost:8081/actuator/health
GET http://localhost:8082/actuator/health
```

These endpoints assume the applications are running locally with the configured ports.

## Circuit Breaker Demonstration

1. Send a normal request to the Recommendation API through the gateway.
2. Enable failure simulation on the Recommendation Service.
3. Send repeated requests until the configured failure threshold is reached.
4. Observe the circuit transition from CLOSED to OPEN.
5. Send another request and verify that the configured fallback response is returned.
6. Wait for the configured open-state duration.
7. Observe the HALF_OPEN state and its permitted test calls.
8. Disable failure simulation and verify that successful calls allow the circuit to close.
9. Use latency simulation to demonstrate slow responses and the configured timeout behavior.
10. Observe the state and metrics in the dashboard, Prometheus, and Grafana.

Circuit breaker transitions depend on the configured thresholds, recorded calls, and timing. A single failure does not necessarily open the circuit.

## Monitoring

- **Resilience4j:** Circuit breaker state and call statistics.
- **Spring Boot Actuator:** Application health and metrics endpoints.
- **Prometheus:** Metric collection and queries.
- **Grafana:** Metric visualization.
- **Zipkin:** Distributed tracing, when tracing instrumentation is configured.

Circuit breaker failures should not be confused with HTTP 5xx responses. A successful fallback response may use HTTP 200 while the original downstream call has failed.

## Frontend Production Build

From the `circuit-breaker-ui` directory:

```bash
npm run build
```

The production build was verified successfully during development.

## Requirements

See [requirement.md](requirement.md) for the functional requirements, architecture, API contracts, circuit breaker configuration, monitoring requirements, and acceptance criteria.

## Repository Structure

```text
AXLERO-SOLUTIONS/
├── infrastructure/
│   ├── api-gateway/
│   └── eureka-server/
├── services/
│   ├── product-service/
│   ├── inventory-service/
│   └── recommendation-service/
├── circuit-breaker-ui/
├── requirement.md
└── README.md
```

## Project Status

The circuit breaker behavior, fallback handling, failure and latency simulation, monitoring integration, and frontend production build have been tested during development. Final integration and code review should verify the latest committed state and all services together.
