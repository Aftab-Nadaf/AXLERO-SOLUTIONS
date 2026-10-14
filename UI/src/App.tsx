import { useCallback, useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { Boxes, Info, PackageCheck, Sparkles } from "lucide-react";
import AppDetails from "./Component/AppDetail";
import ActiveService from "./Component/ActiveService";
import RequestRate from "./Component/Requestrate";
import ResponseTime from "./Component/ResponseTime";
import ServiceDetails from "./Component/serviceDetails";
import Testing from "./Component/Testing";
import CircuitBreakerStates from "./Component/CircuitBreakerStates";
import RateLimiting from "./Component/Ratelimiting";
import Bulkhead from "./Component/Bulkhead";
import Distributedtracing from "./Component/Distributedtracing";
import Logging from "./Component/Logging";
import RequestApi from "./Component/RequestApi";
import BackendServicePage from "./Component/BackendServicePage";
import RecommendationsPage from "./Component/RecommendationsPage";
import {
  getApiErrorMessage,
  getDashboardData,
  getGatewayTelemetry,
  getRecommendations,
  type DashboardData,
  type GatewayTelemetry,
  type RateLimitStatus,
} from "./api/dashboardApi";

type DashboardPage = "dashboard" | "products" | "inventory" | "recommendations" | "api";

const App = () => {
  const [currentPage, setCurrentPage] = useState<DashboardPage>("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [gatewayTelemetry, setGatewayTelemetry] = useState<GatewayTelemetry | null>(null);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(true);
  const [recommendationRateLimit, setRecommendationRateLimit] = useState<RateLimitStatus | null>(null);
  const [recommendationStatus, setRecommendationStatus] = useState<"checking" | "service" | "fallback" | "unknown" | "unavailable">("checking");
  const [recommendationRefreshKey, setRecommendationRefreshKey] = useState(0);

  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardData();
      setDashboardData(data);
      setRequestError(null);
      setLastUpdated(new Date());
    } catch (error) {
      setRequestError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGatewayTelemetry = useCallback(async () => {
    setIsTelemetryLoading(true);
    try {
      setGatewayTelemetry(await getGatewayTelemetry());
    } catch (error) {
      setGatewayTelemetry(null);
      console.error("Could not load API Gateway telemetry:", error);
    } finally {
      setIsTelemetryLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    getDashboardData(controller.signal)
      .then((data) => {
        if (!isActive) return;
        setDashboardData(data);
        setRequestError(null);
        setLastUpdated(new Date());
      })
      .catch((error: unknown) => {
        if (isActive) setRequestError(getApiErrorMessage(error));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getGatewayTelemetry(controller.signal)
      .then((telemetry) => setGatewayTelemetry(telemetry))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setGatewayTelemetry(null);
          console.error("Could not load API Gateway telemetry:", error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsTelemetryLoading(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getRecommendations(1, controller.signal)
      .then((data) => {
        setRecommendationStatus(data.source);
        setRecommendationRateLimit(data.rateLimit);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setRecommendationStatus("unavailable");
          setRecommendationRateLimit(null);
          console.error("Could not check the recommendation service:", error);
        }
      });

    return () => controller.abort();
  }, [recommendationRefreshKey]);

  const navigationItems = [
    { page: "dashboard" as const, label: "Dashboard", icon: <IoMdHome /> },
    { page: "products" as const, label: "Products", icon: <Boxes /> },
    { page: "inventory" as const, label: "Inventory", icon: <PackageCheck /> },
    { page: "recommendations" as const, label: "Recommendations", icon: <Sparkles /> },
    { page: "api" as const, label: "API Gateway", icon: <FaRegFileAlt /> },
  ];

  return (
    <div className="maincontainer grid h-screen w-screen">
      <div className="sidebarcontainer h-screen">
        <div className="logocontainer">
          <div><FaCartShopping size={35} color="oklch(54.6% 0.245 262.881)" className="mt-3" /></div>
          <div>
            <h2>CircuitBreaker</h2>
            <p>E-commerce Platform</p>
          </div>
        </div>
        <ul className="text-white -mt-7">
          {navigationItems.map((item) => (
            <li className={currentPage === item.page ? "is-active" : ""} key={item.page}>
              <span>{item.icon}</span>
              <button
                type="button"
                onClick={() => setCurrentPage(item.page)}
                aria-current={currentPage === item.page ? "page" : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="versionDetail">
          <p>CircuitBreaker Project v1.0.0</p>
        </div>
      </div>
      <div className="maincontentcontainer bg-gray-100 w-full h-screen">
        {currentPage === "api" ? <RequestApi onRateLimitUpdate={setRecommendationRateLimit} /> :
          currentPage === "recommendations" ? <RecommendationsPage onRateLimitUpdate={setRecommendationRateLimit} /> :
          currentPage === "products" || currentPage === "inventory" ? (
            <BackendServicePage
              service={currentPage}
              data={dashboardData}
              isLoading={isLoading}
              error={requestError}
            />
          ) : (
          <>
        <div className="Appdetailcontainer">
          <AppDetails
            isLoading={isLoading}
            hasData={dashboardData !== null}
            lastUpdated={lastUpdated}
            inventoryStatus={dashboardData?.inventoryStatus ?? "unknown"}
            onRefresh={() => {
              void refreshDashboard();
              void refreshGatewayTelemetry();
              setRecommendationStatus("checking");
              setRecommendationRefreshKey((current) => current + 1);
            }}
          />
        </div>
        {requestError && (
          <div className="dashboard-alert" role="alert">
            <IoWarningOutline size={18} />
            <span>{requestError} {dashboardData ? "Showing the last successful data." : "Dashboard data is unavailable."}</span>
          </div>
        )}
        <div className="gateway-data-notice" role="note">
          <Info size={16} aria-hidden="true" />
          <span>Catalog, inventory, rate-limit headers, and gateway metrics are live. Distributed traces are loaded through the API Gateway from Zipkin.</span>
        </div>
        <div className="servicedetailcontainer">
          <div className="runupcontainer">
            <ActiveService
              data={dashboardData}
              isLoading={isLoading}
              recommendationStatus={recommendationStatus}
            />
          </div>
          <div className="latencycontainer">
            <ResponseTime telemetry={gatewayTelemetry?.requests ?? null} isLoading={isTelemetryLoading} />
          </div>
        </div>
        <div className="servicecontainer">
          <div className="overview">
            <ServiceDetails data={dashboardData} isLoading={isLoading} />
          </div>
          <div className="testercontainer">
            <Testing health={gatewayTelemetry?.health ?? null} isLoading={isTelemetryLoading} />
          </div>
        </div>
        <div className="extramovementcontainer">
          <div className="circuitcontainer">
            <CircuitBreakerStates telemetry={gatewayTelemetry?.circuitBreaker ?? null} isLoading={isTelemetryLoading} />
          </div>
          <div className="ratelimitingcontainer">
            <RateLimiting rateLimit={recommendationRateLimit} />
          </div>
          <div className="bulkheadcontainer">
            <Bulkhead telemetry={gatewayTelemetry?.executor ?? null} isLoading={isTelemetryLoading} />
          </div>
        </div>
        <div className="actvitycontainer">
          <div className="requestcontainer">
            <RequestRate telemetry={gatewayTelemetry?.requests ?? null} isLoading={isTelemetryLoading} />
          </div>
          <div className="distributetracingcontainer">
            <Distributedtracing telemetry={gatewayTelemetry?.traces ?? null} isLoading={isTelemetryLoading} />
          </div>
          <div className="logscontainer">
            <Logging telemetry={gatewayTelemetry?.logEvents ?? null} isLoading={isTelemetryLoading} />
          </div>
        </div>
          </>
        )}
      </div>
    </div>
 
  );

}

export default App;
