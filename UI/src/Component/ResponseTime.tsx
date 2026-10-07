import { FaArrowUp,FaArrowDown,FaRegClock  } from "react-icons/fa";
import {Network} from "lucide-react";

const ResponseTime = () =>{
    let reqlist = null;
    return(
        <div className="container">
            <div>
                    <div><FaRegClock /></div>
                    <div>
                        <h4></h4>
                        <h5>Avg. Response Time</h5>
                        <p></p>
                    </div>
                    <div>
                        {reqlist?<FaArrowDown />:<FaArrowUp />}
                    </div>
                </div>
                <div>
                    <Network />
                    <div>
                        <h4></h4>
                        <h5>Traces/min</h5>
                        <p>via Zipkin</p>
                    </div>
                </div>
        </div>
    );
}

export default ResponseTime;