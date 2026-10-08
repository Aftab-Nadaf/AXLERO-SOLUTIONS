import { IoCubeOutline } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaArrowUp,FaArrowDown  } from "react-icons/fa";
import ResponseTime from "./ResponseTime";
import "../index.css"


const ActiveService = () =>{
    let reqlist = null;
    return(
        <div className="Bcontainer">
            <div className="totalservicecontainer">
                <div className="b1 ml-4 ">
                    <div><IoCubeOutline  size={50} color="green" className="bg-emerald-100"/></div>
                    <div className="b2 grid">
                        <h4>Link with API</h4>
                        <h5>Services Up</h5>
                        <p>LINK with API</p>
                    </div>
                </div>
                <div className="b1">
                    <CiCircleAlert size={50} color="red" className="bg-red-100"/>
                    <div className="b2">
                        <h4>LINK with API</h4>
                        <h5>Services Down</h5>
                        <p>LINK with API</p>
                    </div>
                </div>
                <div className="b5">
                    <div className="b6"><TbActivityHeartbeat size={50} color="viol9et"/></div>
                    <div className="b3">
                        <h4>LINK with API</h4>
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