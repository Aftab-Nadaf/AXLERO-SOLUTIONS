import { ChartNoAxesColumn } from "lucide-react";

const ServiceDetails = () => {
    return (
        <div className="container">
            <div className="servicecontainer">
                <div>
                    <ChartNoAxesColumn />
                    <div>
                        <h3>Services Overview</h3>
                        <p>Health,resilence patterns and quick actions</p>
                    </div>
                </div>
                <div>
                    <table>
                        <thead>
                            <th>
                                <td>Services</td>
                                <td>Health</td>
                                <td>Circuit Breakers</td>
                                <td>
                                    <p>Rate limit</p>
                                    <p>(req/min)</p>
                                </td>
                                <td>
                                    <p>Bulkhead</p>
                                    <p>(active/max)</p>
                                </td>
                                <td>Response Time</td>
                                <td>Actions</td>
                            </th>
                        </thead>
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="testingcontainer"></div>
        </div>
    );
}

export default ServiceDetails;