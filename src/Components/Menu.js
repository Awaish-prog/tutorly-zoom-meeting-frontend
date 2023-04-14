import { Link } from "react-router-dom";
import "../CSS/Meetings.css"


export default function Menu(){
    return (
        <div className="menu">
            <ul><Link to="/previousMeetings">Previous Meetings</Link></ul>
            <ul><Link to="/upcomingMeetings">Upcoming Meetings</Link></ul>
        </div>
    )
}