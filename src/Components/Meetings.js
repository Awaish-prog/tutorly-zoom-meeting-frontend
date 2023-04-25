import { useState } from "react";
import "../CSS/Meetings.css"
import Meeting from "./Meeting";


export default function Meetings({ meetings, role, previous }){

    const timeZones = [['PST', 'America/Los_Angeles'],[ 'EST', 'America/New_York'], [ 'CST', 'America/Chicago'], ['IST', 'Asia/Kolkata'], ['MST', 'America/Denver']]
    const [ timeZone, setTimeZone ] = useState({ timeZone: 'America/Los_Angeles' })


    function changeTimeZone(e){
        setTimeZone({ timeZone: e.target.value })
    }

    return (
        <div className="meetings-list-container">
            {previous ? <h1>Previous Meetings</h1> : <h1>Upcoming Meetings</h1>}
            <div className="select-timezone">
            <label>Select Timezone: </label>
            <select className="timezone" onChange={changeTimeZone}>
            <optgroup>
                {
                    timeZones.map((timeZone, index) => {
                        return <option key={index} value={timeZone[1]}>{timeZone[0]}</option>
                    })
                }
            </optgroup>
            </select>
            </div>
            <div className="meetings-list">
            {
                meetings.map((meeting, index) => {
                    return <Meeting key={index} meeting={meeting} role={role} previous={previous} timeZone={timeZone} />
                })
            }
            </div>
        </div>
    )
}