import { useNavigate } from "react-router-dom"

export default function Meetings({ meetings, role, previous }){

    const navigate = useNavigate()

    function gotoMeetingDetails(meeting){
        navigate("/meetingDetails", { state : { meeting, role } })
    }

    return (
        <>
            {previous ? <h1>Previous Meetings</h1> : <h1>Upcoming Meetings</h1>}
            {
                meetings.map((meeting, index) => {
                    return <div key={index} onClick = {() => gotoMeetingDetails(meeting)}>
                        <p>Title: {meeting.type}</p>
                        <p>Date-time: {`${meeting.date} ${meeting.time}`}</p>
                    </div>
                })
            }
        </>
    )
}