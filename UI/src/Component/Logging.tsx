import {IoDocumentTextOutline} from "react-icons/io5";


const Logging = () =>
{
    return (
        <div className="container">
            <div>
                <IoDocumentTextOutline />
                <h4>Recent Events</h4>
                <a href="">View All</a>
            </div>
            <table>
                <thead>
                    <th>
                        <td>Time</td>
                        <td>Service</td>
                        <td>Event</td>
                    </th>
                </thead>
                <tbody>
                    <tr></tr>
                </tbody>
            </table>
        </div>
    );
}
export default Logging;