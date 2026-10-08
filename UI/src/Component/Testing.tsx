import {Zap} from "lucide-react";
import { MdOutlineLightbulb } from "react-icons/md";
import { BiSolidPieChartAlt } from "react-icons/bi";
import { FiAlertTriangle } from "react-icons/fi";
import { IoReload } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";
import "../index.css"

const Testing = () =>{
    return (
        <div className="container">
            <div>
               <Zap /> 
               <div>
                <h4>Chaos Testing / Demo Controls</h4>
                <p>Triggers failures to see resilience in action</p>
               </div>
            </div>
            <div>
                <MdOutlineLightbulb />
                <div>
                    <h4></h4>
                    <p>Simulate latency or failure to test Circuit Breaker</p>
                </div>
            </div>
            <div>
                <div>
                    <BiSolidPieChartAlt />
                    <h5>Trigger Latency(5s)</h5>
                </div>
                <div>
                    <FiAlertTriangle />
                    <h5>Simulate Failure</h5>
                </div>
                <div>
                    <IoReload />
                    <h5>Reset Service</h5>
                </div>
            </div>
            <div>
                <CiCircleAlert />
                <p>Use these controls to see the Circuit Breaker tripping and fallback responses in real time</p>
            </div>
        </div>
    );

}

export default Testing;