import { useState } from "react";
import { useLocation } from "react-router-dom"
import { cancelAppointmentWithId, getAvailability, rescheduleMeetingWithTime } from "../apiCalls/apiCalls";

export default function MeetingDeatils(){

    const location = useLocation()

    const [ message, setMessage ] = useState("")
    const [ availabilityDate, setAvailabilityDate ] = useState("")
    const [ availabilities, setAvailabilities ] = useState([])
    const [ rescheduleDate, setRescheduleDate ] = useState("")
    const timeZones = [['PST', 'America/Los_Angeles'],[ 'EST', 'America/New_York'], [ 'CST', 'America/Chicago'], ['IST', 'Asia/Kolkata'], ['MST', 'America/Denver']]

    const meeting = location.state.meeting
    const timeZone = location.state.timeZone
    

    function checkRecording(e){
        if(!meeting.notes){
            e.preventDefault()
            setMessage("recording is not available");
        }
    }

    async function checkAvailabilityWithdate(e){
        e.preventDefault()
        const res = await getAvailability(availabilityDate, meeting.appointmentTypeID)
        setAvailabilities(res.timings)
        setRescheduleDate(res.timings[0].time.slice(0, 16))
    }

    async function rescheduleMeeting(e){
        e.preventDefault()
        const res = await rescheduleMeetingWithTime(rescheduleDate.slice(0, 16), meeting.id)
        setMessage(res.appointment.message)
    }

    function changeRescheduleDate(e){
        setRescheduleDate(e.target.value)
    }

    async function cancelAppointment(){
        const res = await cancelAppointmentWithId(meeting.id) 
        setMessage(res.appointment.message)
    }

    return <>
        <p>{meeting.firstName}</p>
        <p>{meeting.lastName}</p>
        <p>{meeting.calendar}</p>
        <p>{new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
        <p>{meeting.type}</p>
        <p>{message}</p>
        <p><a onClick={checkRecording} href={meeting.notes ? meeting.notes : ""} target="_blank">Recording Link</a></p>
        <button>Reschedule</button>
        <button onClick={cancelAppointment}>Cancel</button>
        <h3>Check Availability</h3>
        <form onSubmit={(e) => checkAvailabilityWithdate(e)}>
            <label>Select Date:</label>
            <input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)}></input>
            <input type="submit"></input>
        </form>
        <h3>Select Time</h3>
        <form onSubmit={rescheduleMeeting}>
            {
                availabilities.map((availability, index) => {
                    return <div key={index}>
                    <input type = "radio" value={availability.time} onChange={changeRescheduleDate} checked = {rescheduleDate === availability.time} />
                    <label>{new Date(availability.time).toLocaleString('en-US', timeZone)}</label>
                    </div>
                })
            }
            <input type="submit" />
        </form>
    </>
}