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





const App = () => {
  return (
    <div className="maincontainer grid">
      <div className="sidebarcontainer">
        <div className="logocontainer">
          <div><FaCartShopping size={40} color="oklch(54.6% 0.245 262.881)" className="mt-3" /></div>
          <div>
            <h2>CircuitBreaker</h2>
            <p className="text-md -mt-2">E-commerce Platform</p>
          </div>
        </div>
        <ul className="text-white -mt-7">
          <li><span><IoMdHome size={30} /></span>Dashboard</li>
          <li><span><IoCubeOutline size={30} /></span>Services</li>
          <li><span><CiCircleAlert size={30} /></span>Circuit Breakers</li>
          <li><span><FaGaugeHigh size={30} /></span>Rate Limiting</li>
          <li><span><FaShieldHalved size={30} /></span>Bulkheads</li>
          <li><span><PiShareNetworkBold size={30} /></span>Distributed Tracing</li>
          <li><span><FaRegFileAlt size={30} /></span>API Gateway</li>
          <li><span><IoDocumentTextOutline size={30} /></span>Logs</li>
          <li><span><IoWarningOutline size={30} /></span>Chaos Testing</li>
          <li><span><GoGear size={30} /></span>Settings</li>
        </ul>
        <div className="versionDetail">
          <p>CircuitBreaker Project v1.0.0</p>
        </div>
      </div>
      <div className="maincontentcontainer">
        <div className="Appdetailcontainer">
          <AppDetails />
        </div>
        <div className="servicedetailcontainer">
          <div className="runupcontainer">
            <ActiveService />
          </div>
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
 
  );

}

export default App;
