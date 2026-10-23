
import './App.css'
import { useEffect, useState } from 'react';


const HEALTH_ENDPOINTS = [
  {
    name: 'Product Service',
    port: '8080',
    url: '/api-health/product',
  },
  {
    name: 'Inventory Service',
    port: '8081',
    url: '/api-health/inventory',
  },
  {
    name: 'Recommendation Service',
    port: '8082',
    url: '/api-health/recommendation',
  },
];

function useServiceHealth() {
  const [services, setServices] = useState(
    HEALTH_ENDPOINTS.map((service) => ({
      ...service,
      status: 'CHECKING',
    }))
  );

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      const results = await Promise.all(
        HEALTH_ENDPOINTS.map(async (service) => {
          try {
            const response = await fetch(service.url);
            if (!response.ok) throw new Error('Health check failed');

            const data = await response.json();

            return {
              ...service,
              status: data.status === 'UP' ? 'UP' : 'DOWN',
            };
          } catch {
            return { ...service, status: 'DOWN' };
          }
        })
      );

      if (!cancelled) setServices(results);
    }

    checkHealth();
    const intervalId = setInterval(checkHealth, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return services;
}


function useCircuitBreakerState() {
  const [circuit, setCircuit] = useState({
    state: 'CHECKING',
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchCircuitState() {
      try {
        const response = await fetch('/api-monitoring/circuit-breaker');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setCircuit({
            state: data.state,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setCircuit({
            state: 'UNAVAILABLE',
            error: error.message,
          });
        }
      }
    }

    fetchCircuitState();
    const intervalId = setInterval(fetchCircuitState, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return circuit;
}


function useCircuitBreakerMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMetrics() {
      try {
        const response = await fetch(
          '/api-monitoring/circuit-breaker/metrics'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const data = await response.json();

        if (!cancelled) {
          setMetrics(data);
        }
      } catch (error) {
        console.error('Circuit breaker metrics error:', error);
      }
    }

    fetchMetrics();

    const intervalId = setInterval(fetchMetrics, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return metrics;
}


function useGatewayMetrics() {
  const [gatewayMetrics, setGatewayMetrics] = useState({
    requestRate: null,
    latencyMs: null,
    errorRate: null,
    failedCalls: null,
    successfulCalls: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function queryPrometheus(query) {
      const url =
        `/api-prometheus/api/v1/query?query=${encodeURIComponent(query)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Prometheus returned HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json.status !== 'success') {
        throw new Error('Prometheus query failed');
      }

      const result = json.data.result;
      return result.length ? Number(result[0].value[1]) : null;
    }

    async function fetchMetrics() {
      try {

        const [requestRate, latencySeconds, errorRate, failedCalls, successfulCalls,] =
          await Promise.all([
            queryPrometheus(
              'sum(rate(http_server_requests_seconds_count{job="api-gateway"}[1m]))'
            ),
            queryPrometheus(
              'sum(rate(http_server_requests_seconds_sum{job="api-gateway"}[5m])) / sum(rate(http_server_requests_seconds_count{job="api-gateway"}[5m]))'
            ),
            queryPrometheus(
              '100 * (sum(rate(http_server_requests_seconds_count{job="api-gateway",status=~"5.."}[5m])) or vector(0)) / sum(rate(http_server_requests_seconds_count{job="api-gateway"}[5m]))'
            ),
            queryPrometheus(
              'resilience4j_circuitbreaker_calls_seconds_count{job="api-gateway",instance="host.docker.internal:8083",name="recommendationCircuitBreaker",kind="failed"}'
            ),
            queryPrometheus(
              'resilience4j_circuitbreaker_calls_seconds_count{job="api-gateway",name="recommendationCircuitBreaker",kind="successful"}'
            ),
          ]);

        if (!cancelled) {
          setGatewayMetrics({
            requestRate,
            latencyMs:
              latencySeconds !== null ? latencySeconds * 1000 : null,
            errorRate,
            failedCalls,
            successfulCalls,
          });
        }

      } catch (error) {
        console.error('Gateway metrics error:', error);
      }
    }

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return gatewayMetrics;
}



function useResilienceControls() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [failureEnabled, setFailureEnabled] = useState(false);

  async function toggleFailure(enable) {
    if (loading) return;

    setLoading(true);
    setMessage('');

    try {
      const action = enable ? 'enable' : 'disable';

      const response = await fetch(
        `/api-recommendation/recommendations/admin/failure/${action}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setFailureEnabled(enable);
      setMessage(
        enable
          ? 'Simulated failure enabled successfully.'
          : 'Simulated failure disabled successfully.'
      );
    } catch (error) {
      setMessage(`Request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return { loading, message, failureEnabled, toggleFailure };
}


function App() {
  const circuit = useCircuitBreakerState();
  const services = useServiceHealth();
  const metrics = useCircuitBreakerMetrics();
  const gatewayMetrics = useGatewayMetrics();
  const resilience = useResilienceControls();

  const healthyServices = services.filter(
    (service) => service.status === 'UP'
  ).length;

  const circuitState = circuit.state;

  console.log('Circuit breaker metrics:', metrics);


  const [latencyEnabled, setLatencyEnabled] = useState(false);
  const [latencyLoading, setLatencyLoading] = useState(false);
  const [latencyMessage, setLatencyMessage] = useState('');

  const toggleLatency = async (enable) => {
    setLatencyLoading(true);
    setLatencyMessage('');

    try {

      const endpoint = enable
        ? '/api-recommendation/recommendations/admin/latency/enable'
        : '/api-recommendation/recommendations/admin/latency/disable';


      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setLatencyEnabled(enable);
      setLatencyMessage(
        enable
          ? 'Latency simulation enabled (3-second delay).'
          : 'Latency simulation disabled.'
      );
    } catch (error) {
      setLatencyMessage(`Could not update latency: ${error.message}`);
    } finally {
      setLatencyLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">CB</div>
          <div>
            <h2>Circuit Breaker</h2>
            <p>AXLERO SOLUTIONS</p>
          </div>
        </div>

        <nav className="navigation">
          <a className="nav-item active" href="#overview">Dashboard</a>
          <a className="nav-item" href="#services">Services</a>
          <a className="nav-item" href="#circuits">Circuit Breakers</a>
          <a className="nav-item" href="#metrics">Metrics</a>
          <a className="nav-item" href="#testing">Resilience Testing</a>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Monitoring Console
          <p>Development Environment</p>
        </div>
      </aside>

      {/* Main body starts here */}

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">RESILIENCE MONITORING</p>
            <h1>System Overview</h1>
          </div>
          
        </header>

        <section id="overview" className="welcome-section">
          <div>
            <p className="eyebrow">MICROSERVICES OBSERVABILITY</p>
            <h2>Monitor. Detect. Recover.</h2>
            <p>
              Monitor service health and circuit breaker behavior
              from one dashboard.
            </p>
          </div>
          <div className="welcome-symbol">↗</div>
        </section>

        {/* Microservice Health */}
        <section className="summary-grid">
          <article className="summary-card">
            <div className="card-heading">
              <span>Registered Services</span>
              <span className="card-icon blue">S</span>
            </div>
            <h3>3</h3>
            <p>Product, Inventory, Recommendation</p>
          </article>

          <article className="summary-card">
            <div className="card-heading">
              <span>Healthy Services</span>
              <span className="card-icon green">✓</span>
            </div>
            <h3>{healthyServices} / {services.length}</h3>
            <p>Services reporting UP status</p>
          </article>

          <article className="summary-card">
            <div className="card-heading">
              <span>Circuit Breaker Status</span>
              <span className="card-icon red">!</span>
            </div>
            <h3>{circuitState}</h3>
            <p>Recommendation Service Circuit</p>
          </article>

          <article className="summary-card">
            <div className="card-heading">
              <span>Gateway Request Rate</span>
              <span className="card-icon purple">↗</span>
            </div>
            <h3>{gatewayMetrics.requestRate !== null
              ? gatewayMetrics.requestRate.toFixed(2)
              : '—'}</h3>
            <p>Requests per second · API Gateway</p>
          </article>
        </section>

        {/* Microservice Health */}
        <section id="services" className="content-panel">
          <div className="section-heading">
            <div>
              <h2>Microservice Health</h2>
              <p>Health status of the registered services</p>
            </div>
            <span className="section-label">{services.every((service) => service.status === 'UP')
              ? 'All services healthy'
              : services.some((service) => service.status === 'CHECKING')
                ? 'Checking services'
                : 'Service issue detected'}</span>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <ServiceRow
                key={service.name}
                name={service.name}
                port={service.port}
                status={service.status}
              />
            ))}
          </div>
        </section>

        {/* Recommendation Circuit Breaker */}
        <section id="circuits" className="content-panel">
          <div className="section-heading">
            <div>
              <h2>Recommendation Circuit Breaker</h2>
              <p>Resilience4j monitoring · API Gateway</p>
            </div>
            <span className="section-label">displaying Live data</span>
          </div>

          <div className="circuit-overview">
            <CircuitCard
              name="Recommendation Service"
              state={circuit.state}
            />
            <article className="circuit-details">
              <div className="details-heading">
                <div>
                  <h3>Circuit Health</h3>
                  <p>Resilience4j metrics</p>
                </div>
                <span className="details-icon">↗</span>
              </div>

              <div className="health-metric">
                <div className="metric-icon failure-icon">%</div>
                <div className="health-metric-info">
                  <span>Failure Rate</span>
                  <strong>{metrics && metrics.failureRate >= 0
                    ? `${metrics.failureRate.toFixed(1)}%`
                    : 'N/A'}</strong>
                </div>
              </div>

              <div className="health-metric">
                <div className="metric-icon latency-icon">◷</div>
                <div className="health-metric-info">
                  <span>Slow Calls</span>
                  <strong>{metrics?.numberOfSlowCalls ?? '—'}</strong>
                </div>
              </div>

              <div className="health-metric">
                <div className="metric-icon recovery-icon">↻</div>
                <div className="health-metric-info">
                  <span>Recovery Checks</span>
                  <strong>{metrics
                    ? `${metrics.numberOfSuccessfulCalls} successful / ${metrics.numberOfFailedCalls} failed`
                    : 'Loading...'}</strong>
                </div>
              </div>
            </article>
          </div>

          {/* Circuit Breaker Lifecycle */}
          <div className="lifecycle-panel">
            <div className="lifecycle-heading">
              <h3>Circuit Breaker Lifecycle</h3>
              <span>State transitions</span>
            </div>

            <div className="lifecycle-flow">
              <div className="lifecycle-state closed-state">
                <span className="lifecycle-dot" />
                <strong>CLOSED</strong>
                <small>Requests allowed</small>
              </div>

              <span className="lifecycle-arrow">→</span>

              <div className="lifecycle-state open-state">
                <span className="lifecycle-dot" />
                <strong>OPEN</strong>
                <small>Calls blocked</small>
              </div>

              <span className="lifecycle-arrow">→</span>

              <div className="lifecycle-state half-open-state">
                <span className="lifecycle-dot" />
                <strong>HALF-OPEN</strong>
                <small>Recovery testing</small>
              </div>
            </div>

            <p className="lifecycle-note">
              Illustrative lifecycle. The actual circuit state will come from
              Resilience4j metrics.
            </p>
          </div>
        </section>

        {/* Performance Metrics  */}
        <section id="metrics" className="content-panel">
          <div className="section-heading">
            <div>
              <h2>Performance Metrics</h2>
              <p>Gateway traffic and reliability</p>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-placeholder">
              <h3>Request Rate</h3>
              <p>{gatewayMetrics.requestRate !== null
                ? `${gatewayMetrics.requestRate.toFixed(2)} req/s`
                : 'Waiting for metrics'}</p>
            </div>
            <div className="metric-placeholder">
              <h3>Response Latency</h3>
              <p>{gatewayMetrics.latencyMs !== null
                ? `${gatewayMetrics.latencyMs.toFixed(2)} ms`
                : 'Waiting for metrics'}</p>
            </div>
            <div className="metric-placeholder">
              <h3>5xx Error Rate</h3>
              <p>{gatewayMetrics.errorRate !== null
                ? `${gatewayMetrics.errorRate.toFixed(2)}%`
                : 'Waiting for metrics'}</p>
            </div>
            <div className="metric-placeholder">
              <h3>Circuit Breaker Failed Calls</h3>
              <p>
                {gatewayMetrics.failedCalls !== null
                  ? Math.round(gatewayMetrics.failedCalls)
                  : 'Waiting for metrics'}
              </p>
            </div>

            <div className="metric-placeholder">
              <h3>Circuit Breaker Successful Calls</h3>
              <p>
                {gatewayMetrics.successfulCalls !== null
                  ? Math.round(gatewayMetrics.successfulCalls)
                  : 'Waiting for metrics'}
              </p>
            </div>

          </div>
        </section>



        {/* Resilience Testing */}
        <section id="testing" className="content-panel">
          <div className="section-heading">
            <div>
              <h2>Resilience Testing</h2>
              <p>Controlled failure and latency demonstrations</p>
            </div>
            <span className="section-label">
              Failure and latency controls
            </span>
          </div>

          {/* Failure Simulation Controls */}
          <div className="testing-placeholder">
            <div>
              <h3>Failure Simulation</h3>
              <p>Simulate failures to test circuit breaker behavior.</p>
            </div>

            <div className="resilience-actions">
              <button
                type="button"
                className="failure-button enable-button"
                onClick={() => resilience.toggleFailure(true)}
                disabled={resilience.loading || resilience.failureEnabled}
              >
                {resilience.loading && !resilience.failureEnabled
                  ? 'Processing...'
                  : 'Enable Failure'}
              </button>

              <button
                type="button"
                className="failure-button disable-button"
                onClick={() => resilience.toggleFailure(false)}
                disabled={resilience.loading || !resilience.failureEnabled}
              >
                {resilience.loading && resilience.failureEnabled
                  ? 'Processing...'
                  : 'Disable Failure'}
              </button>
            </div>

            {resilience.message && (
              <p className="resilience-message" role="status">
                {resilience.message}
              </p>
            )}
          </div>

          {/* Latency Simulation Controls — separate row */}
          <div className="latency-controls">
            <div className="latency-description">
              <h3>Latency Simulation</h3>
              <p>Add a 3-second delay to recommendation requests.</p>
              <p>
                Status: {latencyEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>

            <div className="resilience-actions">
              <button
                type="button"
                className="failure-button enable-button"
                onClick={() => toggleLatency(true)}
                disabled={latencyLoading || latencyEnabled}
              >
                {latencyLoading && !latencyEnabled
                  ? 'Processing...'
                  : 'Enable Latency'}
              </button>

              <button
                type="button"
                className="failure-button disable-button"
                onClick={() => toggleLatency(false)}
                disabled={latencyLoading || !latencyEnabled}
              >
                {latencyLoading && latencyEnabled
                  ? 'Processing...'
                  : 'Disable Latency'}
              </button>
            </div>

            {latencyMessage && (
              <p className="resilience-message" role="status">
                {latencyMessage}
              </p>
            )}
          </div>
        </section>


        {/* footer */}
        <footer className="dashboard-footer">
          Circuit Breaker Monitoring · AXLERO SOLUTIONS
        </footer>
      </main>
    </div>
  )
}

//reusable components for service rows and circuit cards

function ServiceRow({ name, port, status = "CHECKING" }) {
  const statusConfig = {
    UP: {
      label: "UP",
      className: "status-up",
    },
    DOWN: {
      label: "DOWN",
      className: "status-down",
    },
    CHECKING: {
      label: "CHECKING",
      className: "status-checking",
    },
  };

  const currentStatus = statusConfig[status] ?? statusConfig.CHECKING;

  return (
    <div className="service-row">
      <div className="service-avatar">{name.charAt(0)}</div>

      <div className="service-info">
        <h3>{name}</h3>
        <p>localhost:{port}</p>
      </div>

      <span className={`status-badge ${currentStatus.className}`}>
        {currentStatus.label}
      </span>
    </div>
  );
}



function CircuitCard({ name, state = 'PENDING' }) {
  const stateConfig = {
    CLOSED: {
      label: 'CLOSED',
      description: 'Requests are allowed',
      className: 'closed',
    },
    OPEN: {
      label: 'OPEN',
      description: 'Requests are blocked; fallback may be returned',
      className: 'open',
    },
    HALF_OPEN: {
      label: 'HALF-OPEN',
      description: 'Testing service recovery',
      className: 'half-open',
    },
    PENDING: {
      label: 'PENDING',
      description: 'Waiting for live circuit state',
      className: 'pending',
    },
  }

  const currentState = stateConfig[state] ?? stateConfig.PENDING

  return (
    <article className={`circuit-card ${currentState.className}`}>
      <div className="circuit-card-top">
        <span className="circuit-symbol">◉</span>
        <span className="circuit-state-badge">
          {currentState.label}
        </span>
      </div>

      <h3>{name}</h3>
      <p>{currentState.description}</p>

      <div
        className="circuit-state-indicator"
        aria-label={`Circuit state: ${currentState.label}`}
      >
        <span className="state-step closed-step" />
        <span className="state-step open-step" />
        <span className="state-step half-open-step" />
      </div>

      <div className="circuit-labels">
        <span>Closed</span>
        <span>Open</span>
        <span>Half-open</span>
      </div>
    </article>
  )
}


export default App
