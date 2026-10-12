import { Zap } from "lucide-react";
import { MdOutlineLightbulb } from "react-icons/md";
import { BiSolidPieChartAlt } from "react-icons/bi";
import { FiAlertTriangle } from "react-icons/fi";
import { IoReload } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";
import "../index.css"

const Testing = () => {
    return (
        <div className="tcontainer">
            <div className="t1">
                <Zap size={50} className="my-auto" />
                <div>
                    <h4 className="font-bold">Chaos testing</h4>
                    <p className="text-gray-600">Demo controls for resilience scenarios</p>
                </div>
            </div>
            <div className="t2">
                <MdOutlineLightbulb size={50} color="violet"/>
                <div>
                    <h4>Controls unavailable</h4>
                    <p>A chaos-testing API has not been configured for this dashboard.</p>
                </div>
            </div>
            <div className="t3">
                <button type="button" disabled className="t4 p-2">
                    <BiSolidPieChartAlt size={30}/>
                    <span>Trigger latency (5s)</span>
                </button>
                <button type="button" disabled className="t4 p-2">
                    <FiAlertTriangle size={30}/>
                    <span>Simulate failure</span>
                </button>
                <button type="button" disabled className="t4 p-2">
                    <IoReload size={30}/>
                    <span>Reset service</span>
                </button>
            </div>
            <p className="testing-note">
                <CiCircleAlert size={30} />
                Resilience actions stay disabled until a compatible control endpoint is available.
            </p>
        </div>
    );

}

export default Testing;