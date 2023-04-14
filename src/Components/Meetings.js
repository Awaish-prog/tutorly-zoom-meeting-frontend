import { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../CSS/Meetings.css"


export default function Meetings({ meetings, role, previous }){

    const navigate = useNavigate()
    const timeZones = [['PST', 'America/Los_Angeles'],[ 'EST', 'America/New_York'], [ 'CST', 'America/Chicago'], ['IST', 'Asia/Kolkata'], ['MST', 'America/Denver']]
    const [ timeZone, setTimeZone ] = useState({ timeZone: 'PST' })

    function gotoMeetingDetails(meeting){
        navigate("/meetingDetails", { state : { meeting, role, timeZone } })
    }

    function changeTimeZone(e){
        setTimeZone({ timeZone: e.target.value })
    }

    return (
        <div className="meetings-list-container">
            {previous ? <h1>Previous Meetings</h1> : <h1>Upcoming Meetings</h1>}
            <div className="select-timezone">
            <label>Select Timezone: </label>
            <select onChange={changeTimeZone}>
                {
                    timeZones.map((timeZone, index) => {
                        return <option key={index} value={timeZone[1]}>{timeZone[0]}</option>
                    })
                }
            </select>
            </div>
            <div className="meetings-list">
            {
                meetings.map((meeting, index) => {
                    return <div key={index} onClick = {() => gotoMeetingDetails(meeting)} className="meeting">
                        <p>{meeting.type}</p>
                        <p>{new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
                    </div>
                })
            }
            </div>
        </div>
    )
}