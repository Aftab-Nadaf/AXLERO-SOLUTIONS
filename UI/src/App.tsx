import { useCallback, useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { IoCubeOutline, IoDocumentTextOutline, IoWarningOutline } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";
import { GoGear } from "react-icons/go";
import { FaRegFileAlt } from "react-icons/fa";
import { PiShareNetworkBold } from "react-icons/pi";
import { FaGaugeHigh, FaShieldHalved } from 'react-icons/fa6';
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
import { getApiErrorMessage, getDashboardData, type DashboardData } from "./api/dashboardApi";


const App = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
          <li><span><IoMdHome size={30} /></span><a href="">Dashboard</a></li>
          <li><span><IoCubeOutline size={30} /></span><a href="">Services</a></li>
          <li><span><CiCircleAlert size={30} /></span><a href="">Circuit Breakers</a></li>
          <li><span><FaGaugeHigh size={30} /></span><a href="">Rate Limiting</a></li>
          <li><span><FaShieldHalved size={30} /></span><a>Bulkheads</a></li>
          <li><span><PiShareNetworkBold size={30} /></span><a href="">Distributed Tracing</a></li>
          <li><span><FaRegFileAlt size={30} /></span><a href="">API Gateway</a></li>
          <li><span><IoDocumentTextOutline size={30} /></span><a href="">Logs</a></li>
          <li><span><IoWarningOutline size={30} /></span><a href="">Chaos Testing</a></li>
          <li><span><GoGear size={30} /></span><a href="">Settings</a></li>
        </ul>
        <div className="versionDetail">
          <p>CircuitBreaker Project v1.0.0</p>
        </div>
      </div>
      <div className="maincontentcontainer bg-gray-100 w-full h-screen">
        <div className="Appdetailcontainer">
          <AppDetails
            isLoading={isLoading}
            hasData={dashboardData !== null}
            lastUpdated={lastUpdated}
            inventoryStatus={dashboardData?.inventoryStatus ?? "unknown"}
            onRefresh={() => void refreshDashboard()}
          />
        </div>
        {requestError && (
          <div className="dashboard-alert" role="alert">
            <IoWarningOutline size={18} />
            <span>{requestError} {dashboardData ? "Showing the last successful data." : "Dashboard data is unavailable."}</span>
          </div>
        )}
        <div className="servicedetailcontainer">
          <div className="runupcontainer">
            <ActiveService data={dashboardData} isLoading={isLoading} />
          </div>
          <div className="latencycontainer">
            <ResponseTime />
          </div>
        </div>
        <div className="servicecontainer">
          <div className="overview">
            <ServiceDetails data={dashboardData} isLoading={isLoading} />
          </div>
          <div className="testercontainer">
            <Testing />
          </div>
        </div>
        <div className="extramovementcontainer">
          <div className="circuitcontainer">
            <CircuitBreakerStates />
          </div>
          <div className="ratelimitingcontainer">
            <RateLimiting />
          </div>
          <div className="bulkheadcontainer">
            <Bulkhead />
          </div>
        </div>
        <div className="actvitycontainer">
          <div className="requestcontainer">
            <RequestRate />
          </div>
          <div className="distributetracingcontainer">
            <Distributedtracing />
          </div>
          <div className="logscontainer">
            <Logging />
          </div>
        </div>
      </div>
    </div>
 
  );

}

export default App;
