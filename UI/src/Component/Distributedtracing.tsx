import {PiShareNetworkBold} from "react-icons/pi";


const Distributedtracing = ()=>{
    return(
        <div className="container">
            <div>
                <PiShareNetworkBold />
                <h4>Distributed Tracing (Zipkin)</h4>
                <a href="">View in Zipkin</a>
            </div>
            <table>
                <thead>
                    <th>
                        <td>Trace Id</td>
                        <td> Method </td>
                        <td>Endpoint</td>
                        <td>Services</td>
                        <td>Duration</td>
                    </th>
                </thead>
                <tbody>
                    <tr></tr>
                </tbody>
            </table>
        </div>
    );
}

export default Distributedtracing;