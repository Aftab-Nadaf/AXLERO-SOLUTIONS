import { IoCubeOutline } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaArrowUp,FaArrowDown  } from "react-icons/fa";
import ResponseTime from "./ResponseTime";


const ActiveService = () =>{
    let reqlist = null;
    return(
        <div className="container">
            <div className="totalservicecontainer">
                <div>
                    <IoCubeOutline />
                    <div>
                        <h4></h4>
                        <h5>Services Up</h5>
                        <p></p>
                    </div>
                </div>
                <div>
                    <CiCircleAlert />
                    <div>
                        <h4></h4>
                        <h5>Services Down</h5>
                        <p></p>
                    </div>
                </div>
                <div>
                    <TbActivityHeartbeat />
                    <div>
                        <h4></h4>
                        <h5>Total Request/min</h5>
                        <p>vs last 5 minutes</p>
                    </div>
                    <div>
                        {reqlist?<FaArrowUp />:<FaArrowDown />}
                    </div>
                </div>
            </div>
            <div className="showtakentime">
                <ResponseTime />
            </div>
        </div>
    );
}

export default ActiveService;