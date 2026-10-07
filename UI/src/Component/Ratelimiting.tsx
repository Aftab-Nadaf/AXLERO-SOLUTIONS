import {ChartNoAxesColumn} from "lucide-react";


const RateLimiting = () =>{
    return(
        <div className="container">
            <div>
                <ChartNoAxesColumn /> 
                <h2>Circuit Breaker States</h2>
            </div>
            <div>
                <table>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
        </div>
    );
}

export default RateLimiting;