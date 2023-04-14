import { useState } from "react";
import { useNavigate } from "react-router-dom"

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
        <>
            {previous ? <h1>Previous Meetings</h1> : <h1>Upcoming Meetings</h1>}
            <select onChange={changeTimeZone}>
                {
                    timeZones.map((timeZone, index) => {
                        return <option key={index} value={timeZone[1]}>{timeZone[0]}</option>
                    })
                }
            </select>
            {
                meetings.map((meeting, index) => {
                    return <div key={index} onClick = {() => gotoMeetingDetails(meeting)}>
                        <p>Title: {meeting.type}</p>
                        <p>Date-time: {new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
                    </div>
                })
            }
        </>
    )
}