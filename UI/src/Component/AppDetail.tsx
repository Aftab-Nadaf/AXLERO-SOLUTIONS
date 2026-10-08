import  { useState } from 'react';
import { FaCircle } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { Sun, Moon } from 'lucide-react';
import "../index.css";

let LiveDateTime = () => {
    let time = new Date();
    return time.toLocaleDateString()+" " +time.toLocaleTimeString();
}

const AppDetails = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // Optional: Toggle a 'dark' class on the document element for global CSS
        document.documentElement.classList.toggle('dark');
    };
    return (
        <div className="Acontainer grid mt-3 ml-3 h-auto">
            <div className="justify-items-start">
                <h2 className="text-black text-xl font-bold text-left">System Monitoring & Resilience Dashboard</h2>
                <p className="text-gray-400">Real time monitoring,resilience patterns,distributed tracing and chaos simulations</p>
            </div>
            <div className="grid a1 "><FaCircle color="green" /><span className="text-sm">All Systems Operational</span></div>
            <div className="grid a2">
                <span><LiveDateTime /></span>
                <span className="border-oklch(98.5% 0.002 247.839) "><TbReload /></span>
                <span><button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-amber-100 dark:bg-gray-800 text-amber-300 dark:text-gray-100 hover:bg-amber-200 dark:hover:bg-white-700 transition-colors duration-200"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <Sun size={20}/> : <Moon size={20} />}
                </button></span>
            </div>
        </div>
    );

}
export default AppDetails;