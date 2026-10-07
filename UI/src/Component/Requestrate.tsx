import { CiSquarePlus } from "react-icons/ci";
import { LineChart } from "lucide-react";

const RequestRate = () =>{
    return(
        <div className="container">
            <div>
                <CiSquarePlus />
                <h4>Request Rate (Last 15 Minutes)</h4>
            </div>
            <LineChart />
        </div>
    );
}
export default RequestRate;