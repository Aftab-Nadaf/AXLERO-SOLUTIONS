import { FaArrowUp, FaArrowDown, FaRegClock } from "react-icons/fa";
import { Network } from "lucide-react";
import "../index.css";
const ResponseTime = () => {
    let reqlist = null;
    return (
        <div className="ccontainer grid justify-items-center">
            <div className="c1 justify-items-center">
                <div className="bg-blue-100"><FaRegClock size={50} color="blue" /></div>
                <div className="c2">
                    <h4>Link with Api</h4>
                    <h5>Avg. Response Time</h5>
                    <p>also link</p>
                </div>
                <div>
                    {reqlist ? <FaArrowDown size={7}/> : <FaArrowUp size={7}/>}
                </div>
            </div>
            <div className="c3">
                <div><Network size={50} color="yellow"/></div>
                <div className="c2">
                    <h4>Link with api</h4>
                    <h5>Traces/min</h5>
                    <p>via Zipkin</p>
                </div>
            </div>
        </div>
    );
}

export default ResponseTime;