import { useState } from "react";
import { useLocation } from "react-router-dom"
import { cancelAppointmentWithId, getAvailability, rescheduleMeetingWithTime } from "../apiCalls/apiCalls";
import "../CSS/MeetingDetails.css"

export default function MeetingDeatils(){

    const location = useLocation()

    const [ message, setMessage ] = useState("")
    const [ availabilityDate, setAvailabilityDate ] = useState("")
    const [ availabilities, setAvailabilities ] = useState([])
    const [ rescheduleDate, setRescheduleDate ] = useState("")
    const [ showAvailabilityForm, setShowAvailabilityForm ] = useState(false)

    const meeting = location.state.meeting
    const timeZone = location.state.timeZone
    const previous = location.state.previous
    

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
    }

    async function rescheduleMeeting(e){
        e.preventDefault()
        if(rescheduleDate === ""){
            setMessage("Please select a date")
            return
        }
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

    function showAvailabilityFormToggle(){
        setShowAvailabilityForm(prev => !prev)
        setAvailabilities([])
    }

    return <>
        <h1 className="meeting-heading">{meeting.type}</h1>
        <p className="error-message">{message}</p>
        <div className="meeting-container">
        <div className="meeting-details">
        <p>Student Name: {meeting.firstName} {meeting.lastName}</p>
        <p>Tutor Name: {meeting.calendar}</p>
        <p>Date-time: {new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
        {
            previous ? 
            <button className="meeting-links"><a onClick={checkRecording} href={meeting.notes ? meeting.notes : ""} target="_blank">Recording Link</a></button> 
            :
            <button className="meeting-links"><a href={meeting.location.slice(5, meeting.location.indexOf(" ", 5))} target="_blank">Join Meeting</a></button>
        }
        </div>
        <div className="meeting-actions">
        <h3>Actions</h3>
        {
            previous ?
            <p>No actions available</p>
            : 
            <>
            <button className="meeting-links" onClick={showAvailabilityFormToggle}>Reschedule</button>
            <button className="meeting-links" onClick={cancelAppointment}>Cancel</button>
            {
                showAvailabilityForm && 
                <>
                <h3>Check Availability</h3>
                <form onSubmit={(e) => checkAvailabilityWithdate(e)}>
                    <label>Select Date:</label>
                    <input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)}></input>
                    <input className="meeting-links" type="submit"></input>
                </form>
                {
                    availabilities.length !== 0 &&
                    <>
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
                            <input className="meeting-links" type="submit" />
                        </form>
                    </>
                }
                
            </>
            }
            
            </>
        }
        </div>
        </div>
    </>
}