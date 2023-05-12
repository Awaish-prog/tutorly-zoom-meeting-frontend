import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { cancelAppointmentWithId, getAvailability, rescheduleMeetingWithTime } from "../apiCalls/apiCalls";
import "../CSS/MeetingDetails.css"
import Loader from "../Components/Loader"



export default function MeetingDeatils(){

    const location = useLocation()

    const [ message, setMessage ] = useState("")
    const [ messageReschedule, setMessageReschedule ] = useState("")
    const [ availabilityDate, setAvailabilityDate ] = useState("")
    const [ availabilities, setAvailabilities ] = useState([])
    const [ rescheduleDate, setRescheduleDate ] = useState("")
    const [ showAvailabilityForm, setShowAvailabilityForm ] = useState(false)
    const [ showCancel, setShowCancel ] = useState(false)
    const [ showLoader, setShowLoader ] = useState(false)
    const navigate = useNavigate()

    const timeZoneList = {'America/Los_Angeles': 'PST', 'America/New_York': 'EST', 'America/Chicago':'CST', 'Asia/Kolkata': 'IST','America/Denver': 'MST'}

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
        setShowLoader(true)
        e.preventDefault()
        const res = await getAvailability(availabilityDate, meeting.appointmentTypeID)
        setAvailabilities(res.timings)
        setShowLoader(false)
    }

    function showCancelConfirm(){
        setShowCancel(prev => !prev)
        setShowAvailabilityForm(false)
    }

    async function rescheduleMeeting(e){
        e.preventDefault()
        if(rescheduleDate === ""){
            setMessageReschedule("Please select a date")
            return
        }
        const res = await rescheduleMeetingWithTime(rescheduleDate.slice(0, 16), meeting.id)
        (res.appointment && res.appointment.id) && navigate("/upcomingMeetings", { replace: true })
        
    }

    function changeRescheduleDate(e){
        setRescheduleDate(e.target.value)
    }

    async function cancelAppointment(){
        const res = await cancelAppointmentWithId(meeting.id) 
        setMessage(res.appointment.message)
        (res.appointment && res.appointment.id) && navigate("/upcomingMeetings", { replace: true })
    }

    function showAvailabilityFormToggle(){
        setShowAvailabilityForm(prev => !prev)
        setAvailabilities([])
        setShowCancel(false)
        setRescheduleDate("")
    }

    useEffect(() => {
        if(!localStorage.getItem("email")){
            navigate("/", { replace: true })
        }
    }, [])

    return <>
        <h1 className="meeting-heading">{meeting.type}</h1>
        {timeZoneList[timeZone.timeZone] !== undefined && <h2 className="meeting-heading">Time zone: {timeZoneList[timeZone.timeZone]}</h2>}
        <p className="error-message">{message}</p>
        <div className="meeting-container">
        <div className="meeting-details">
        <p>Student Name: {meeting.firstName} {meeting.lastName}</p>
        <p>Tutor Name: {meeting.calendar}</p>
        <p>Date-time: {new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
        {
            previous ? 
            <p className="meeting-links"><a onClick={checkRecording} href={meeting.notes ? meeting.notes : ""} target="_blank">Recording Link</a></p> 
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
            <button className="meeting-links" onClick={showCancelConfirm} >Cancel</button>
            {
                showCancel &&
                <>
                <p>Cancel this meeting?</p>
                <button className="meeting-links" onClick={cancelAppointment}>Yes</button>
                <button className="meeting-links">No</button>
                </>
            }
            {
                showAvailabilityForm && 
                <>
                <h3>Check Availability</h3>
                <form onSubmit={(e) => checkAvailabilityWithdate(e)}>
                    <label>Select Date:</label>
                    <input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)}></input>
                    <input className="meeting-links" type="submit" value="Check Availability"></input>
                </form>
                {
                    availabilities.length !== 0 &&
                    <>
                        <p className="error-message">{messageReschedule}</p>
                        {
                            showLoader ? 
                            <Loader size={50} color="inherit" /> :
                            <>
                                <h3>Select Time ({timeZoneList[timeZone.timeZone] !== undefined && timeZoneList[timeZone.timeZone]})</h3>
                                <form onSubmit={rescheduleMeeting}>
                                    {
                                        availabilities.map((availability, index) => {
                                            return <div key={index}>
                                            <input type = "radio" value={availability.time} onChange={changeRescheduleDate} checked = {rescheduleDate === availability.time} />
                                            <label>{new Date(availability.time).toLocaleString('en-US', timeZone)}</label>
                                            </div>
                                        })
                                    }
                                    <input className="meeting-links" type="submit" value="Reschedule"/>
                                </form>
                            </>
                        }
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