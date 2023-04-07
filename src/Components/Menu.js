import { Link } from "react-router-dom";

export default function Menu(){
    return (
        <div>
            <ul><Link to="/previousMeetings">Previous Meetings</Link></ul>
            <ul><Link to="/upcomingMeetings">Upcoming Meetings</Link></ul>
        </div>
    )
}