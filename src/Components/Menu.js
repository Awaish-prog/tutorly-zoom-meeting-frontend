import { Link } from "react-router-dom";
import "../CSS/Meetings.css";
import tutorlyLogo from "../Images/tutorly-logo.png"
import "../CSS/Menu.css"


export default function Menu(){
    return (
        <div className="menu">
            <div className="logo-div">
                <img src = {tutorlyLogo} alt="Logo" width="200px" />
            </div>
            <ul className="menu-options">
                <li><Link className="link" to="/dashboard">Dashboard</Link></li>
                <li><Link className="link" to="/previousMeetings">Previous Meetings</Link></li>
                <li><Link className="link" to="/upcomingMeetings">Upcoming Meetings</Link></li>
            </ul>
        </div>
    )
}