import  { useState } from 'react';
import { FaCircle } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { Sun, Moon } from 'lucide-react';


let LiveDateTime = () => {
    let time = Date.now();

    return time.toLocaleString();
}

const AppDetails = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // Optional: Toggle a 'dark' class on the document element for global CSS
        document.documentElement.classList.toggle('dark');
    };
    return (
        <div className="container">
            <div>
                <h2>System Monitoring & Resilience Dashboard</h2>
                <p>Real time monitoring,resilience patterns,distributed tracing and chaos  simulations</p>
            </div>
            <div><FaCircle /><span>All Systems Operational</span></div>
            <div>
                <span><LiveDateTime /></span>
                <span><TbReload /></span>
                <span><button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button></span>
            </div>
        </div>
    );

}
export default AppDetails;