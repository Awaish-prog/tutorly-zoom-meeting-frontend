import { useState } from "react";
import { useLocation } from "react-router-dom"
import { getAvailability } from "../apiCalls/apiCalls";

export default function MeetingDeatils(){

    const location = useLocation()

    const [ message, setMessage ] = useState("")
    const [ availabilityDate, setAvailabilityDate ] = useState("")

    const meeting = location.state.meeting

    function checkRecording(e){
        if(!meeting.notes){
            e.preventDefault()
            setMessage("recording is not available");
        }
    }

    function checkAvailabilityWithdate(e){
        e.preventDefault()
        getAvailability(availabilityDate, meeting.appointmentTypeID)
    }

    return <>
        <p>{meeting.firstName}</p>
        <p>{meeting.lastName}</p>
        <p>{meeting.calendar}</p>
        <p>{meeting.datetime}</p>
        <p>{meeting.type}</p>
        <p>{message}</p>
        <p><a onClick={checkRecording} href={meeting.notes ? meeting.notes : ""} target="_blank">Recording Link</a></p>
        <button>Reschedule</button>
        <button>Cancel</button>
        <h3>Check Availability</h3>
        <form onSubmit={(e) => checkAvailabilityWithdate(e)}>
            <label>Select Date:</label>
            <input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)}></input>
            <input type="submit"></input>
        </form>
    </>
}