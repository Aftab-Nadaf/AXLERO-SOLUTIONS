import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, PackageCheck, RefreshCw, Sparkles, UserRound } from "lucide-react";
import {
  getApiErrorMessage,
  getRecommendations,
  type RateLimitStatus,
  type RecommendationsResponse,
} from "../api/dashboardApi";

interface RecommendationsPageProps {
  onRateLimitUpdate: (status: RateLimitStatus | null) => void;
}

const RecommendationsPage = ({ onRateLimitUpdate }: RecommendationsPageProps) => {
  const [userId, setUserId] = useState("1");
  const [requestedUserId, setRequestedUserId] = useState("1");
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const parsedUserId = Number(requestedUserId);

    getRecommendations(parsedUserId, controller.signal)
      .then((data) => {
        setRecommendations(data);
        setError(null);
        onRateLimitUpdate(data.rateLimit);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError));
          setRecommendations(null);
          onRateLimitUpdate(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [onRateLimitUpdate, requestNumber, requestedUserId]);

  const loadRecommendations = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d+$/.test(userId) || Number(userId) < 1) {
      setError("Enter a valid positive whole-number user ID.");
      setRecommendations(null);
      setIsLoading(false);
      return;
    }
    setError(null);
    setRecommendations(null);
    setIsLoading(true);
    setRequestedUserId(userId);
    setRequestNumber((current) => current + 1);
  };

  return (
    <main className="backend-service-page">
      <header className="backend-service-hero">
        <span className="backend-service-icon"><Sparkles size={20} /></span>
        <div>
          <span className="api-panel-kicker">RECOMMENDATION SERVICE</span>
          <h1>Personalized recommendations</h1>
          <p>Live suggestions returned by the recommendation backend for a user.</p>
        </div>
      </header>

      <section className="backend-service-panel" aria-labelledby="recommendation-form-title">
        <div className="backend-service-panel-heading">
          <div>
            <span className="api-panel-kicker">LIVE BACKEND REQUEST</span>
            <h2 id="recommendation-form-title">Find recommendations</h2>
          </div>
          <span className="backend-endpoint-method">GET</span>
        </div>

        <form className="recommendation-form" onSubmit={loadRecommendations}>
          <label htmlFor="recommendation-user-id">User ID</label>
          <div className="recommendation-input-row">
            <span className="recommendation-user-icon"><UserRound size={17} /></span>
            <input
              id="recommendation-user-id"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? <RefreshCw className="api-spin" size={15} /> : <ArrowUpRight size={15} />}
              {isLoading ? "Loading…" : "Load recommendations"}
            </button>
          </div>
          <code className="recommendation-route">GET /api/recommendations/{userId || "{userId}"}</code>
        </form>
      </section>

      <section className="backend-service-panel recommendations-results" aria-live="polite">
        <div className="backend-service-panel-heading">
          <div>
            <span className="api-panel-kicker">RESULTS</span>
            <h2>{recommendations ? `For user ${recommendations.userId}` : "Recommended products"}</h2>
          </div>
          {recommendations && (
            <span className={`recommendation-count${recommendations.source === "fallback" ? " is-fallback" : ""}`}>
              {recommendations.source === "fallback"
                ? "Gateway fallback"
                : recommendations.source === "service"
                  ? "Live service"
                  : "Source unverified"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="backend-service-message"><RefreshCw className="api-spin" size={19} />Contacting recommendation service…</div>
        ) : error ? (
          <div className="backend-service-error" role="alert">
            <strong>Recommendation service unavailable</strong>
            <span>{error}</span>
            <span>Start the recommendation service and make sure it registers with the API gateway, then try again.</span>
          </div>
        ) : recommendations ? (
          <>
            {recommendations.source === "fallback" && (
              <p className="recommendation-fallback-notice" role="status">
                The recommendation service is offline. Showing gateway fallback results instead.
              </p>
            )}
            {recommendations.source === "unknown" && (
              <p className="recommendation-fallback-notice" role="status">
                The gateway has not identified the response source. Restart the gateway with the latest fallback source reporting enabled.
              </p>
            )}
            {recommendations.recommendations.length ? (
              <div className="recommendation-list">
                {recommendations.recommendations.map((product) => (
                  <article className="recommendation-item" key={product.productId}>
                    <span className="recommendation-product-icon"><PackageCheck size={18} /></span>
                    <span><strong>{product.name}</strong><small>Product ID {product.productId}</small></span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="backend-service-message">No recommendations were returned for this user.</div>
            )}
          </>
        ) : (
          <div className="backend-service-message">No recommendations were returned for this user.</div>
        )}
      </section>
    </main>
  );
};

export default RecommendationsPage;
