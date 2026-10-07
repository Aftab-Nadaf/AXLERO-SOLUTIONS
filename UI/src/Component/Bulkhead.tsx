import { FaLayerGroup } from "react-icons/fa";


const Bulkhead = ()=>{
    return(
        <div className="container">
            <div>
                <FaLayerGroup />
                <h4>Bulkhead (Concurrent Calls)</h4>
            </div>
            <table>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
    );

}

export default Bulkhead;