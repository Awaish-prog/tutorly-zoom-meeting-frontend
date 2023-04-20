import { useNavigate } from "react-router-dom"
import "../CSS/Meetings.css"


export default function Meeting({ meeting, role, previous, timeZone }){
    const navigate = useNavigate()

    function gotoMeetingDetails(meeting){
        navigate("/meetingDetails", { state : { meeting, role, timeZone, previous } })
    }
    return (
        <div onClick = {() => gotoMeetingDetails(meeting)} className="meeting">
            <p>{meeting.type}</p>
            <p>{new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
        </div>
    )
}