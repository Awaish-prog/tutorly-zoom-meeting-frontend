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
                <Link className="link" to="/dashboard"><li>Dashboard</li></Link>
                <Link className="link" to="/previousMeetings"><li>Previous Meetings</li></Link>
                <Link className="link" to="/upcomingMeetings"><li>Upcoming Meetings</li></Link>
                <Link className="link" to="/checkStudentId"><li>Check Student Id</li></Link>
            </ul>
        </div>
    )
}