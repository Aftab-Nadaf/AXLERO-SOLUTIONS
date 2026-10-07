import { FaCartShopping } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { IoCubeOutline, IoDocumentTextOutline, IoWarningOutline } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";
import { GoGear } from "react-icons/go";
import { FaRegFileAlt } from "react-icons/fa";
import { PiShareNetworkBold } from "react-icons/pi";
import { FaGaugeHigh, FaShieldHalved } from 'react-icons/fa6';





const App = () => {
  return (
    <div className="maincontainer">
      <div className="sidebarcontainer">
        <div className="logocontainer">
          <div><FaCartShopping /></div>
          <div>
            <h2>CircuitBreaker</h2>
            <p>E-commerce Platform</p>
          </div>
        </div>
        <ul>
          <li><span><IoMdHome /></span>Dashboard</li>
          <li><span><IoCubeOutline /></span>Services</li>
          <li><span><CiCircleAlert /></span>Circuit Breakers</li>
          <li><span><FaGaugeHigh /></span>Rate Limiting</li>
          <li><span><FaShieldHalved /></span>Bulkheads</li>
          <li><span><PiShareNetworkBold /></span>Distributed Tracing</li>
          <li><span><FaRegFileAlt /></span>API Gateway</li>
          <li><span><IoDocumentTextOutline /></span>Logs</li>
          <li><span><IoWarningOutline /></span>Chaos Testing</li>
          <li><span><GoGear /></span>Settings</li>
        </ul>
        <div className="versionDetail">
          <p>CircuitBreaker Project v1.0.0</p>
        </div>
      </div>
      <div className="maincontentcontainer">
        <div className="Appdetailcontainer"></div>
        <div>
          <div className="servicedetailcontainer">
            <div className="runupcontainer"></div>
            <div className="latencycontainer"></div>
          </div>
          <div className="servicecontainer">
            <div className="overview"></div>
            <div className="testercontainer"></div>
          </div>
          <div className="extramovementcontainer">
            <div className="circuitcontainer"></div>
            <div className="ratelimitingcontainer"></div>
            <div className="bulkheadcontainer"></div>
          </div>
          <div className="actvitycontainer">
            <div className="requestcontainer"></div>
            <div className="distributetracingcontainer"></div>
            <div className="logscontainer"></div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default App;
