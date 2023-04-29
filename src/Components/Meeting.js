import { useNavigate } from "react-router-dom"
import "../CSS/Meetings.css"


export default function Meeting({ meeting, role, previous, timeZone }){
    const navigate = useNavigate()

    const styles = {
        Completed: {
            backgroundColor: 'rgb(34 170 34)',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white'
        },
        unavailable: {
            backgroundColor: 'grey',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white'
        },
        "Canceled<24 h" : {
            backgroundColor: 'red',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white'
        },
        "Canceled> 24h" : {
            backgroundColor: '#1972eb',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white'
        },
        "Canceled>48 h" : {
            backgroundColor: '#313131',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white'
        },
        "Reschedule>24" : {
            backgroundColor: '#6fcf97',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white'
        }, 
        "Reschedule<24" : {
            backgroundColor: '#ed7087',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white'
        }
    }

    function gotoMeetingDetails(meeting){
        navigate("/meetingDetails", { state : { meeting, role, timeZone, previous } })
    }
    return (
        <div onClick = {() => gotoMeetingDetails(meeting)} className="meeting">
            <p>{meeting.type}</p>
            <p>{new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
            {meeting.labels ? 
            <p>status: <span style={styles[meeting.labels[0].name]}>{meeting.labels[0].name}</span></p> :
            <p>status: <span style={styles.unavailable}>Unavailable</span></p>}
        </div>
    )
}