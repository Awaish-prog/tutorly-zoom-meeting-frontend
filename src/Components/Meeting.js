import { useNavigate } from "react-router-dom"
import "../CSS/Meetings.css"
import { markStatus } from "../apiCalls/apiCalls"


export default function Meeting({ meeting, role, previous, timeZone, changeLabel, index, id
 }){
    const navigate = useNavigate()

    const styles = {
        Completed: {
            backgroundColor: 'rgb(34 170 34)',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white',
            status: [ { id: 5559391, name: 'Completed', color: 'green' } ]
        },
        unavailable: {
            backgroundColor: 'grey',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white',
            status: "unavailable"
        },
        "Canceled<24 h" : {
            backgroundColor: 'red',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white',
            status: [ { id: 7238418, name: 'Canceled<24 h', color: 'red' } ]
        },
        "Canceled> 24h" : {
            backgroundColor: '#1972eb',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white',
            status: [ { id: 7238422, name: 'Canceled> 24h', color: 'blue' } ]
        },
        "Canceled>48 h" : {
            backgroundColor: '#313131',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white',
            status: [ { id: 8203144, name: 'Canceled>48 h', color: 'black' } ]
        },
        "Reschedule>24" : {
            backgroundColor: '#6fcf97',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white',
            status: [ { id: 7238437, name: 'Reschedule>24', color: 'cyan' } ]
        }, 
        "Reschedule<24" : {
            backgroundColor: '#ed7087',
            padding: '5px 10px',
            borderRadius: '10px',
            color: 'white',
            status: [ { id: 7238436, name: 'Reschedule<24', color: 'pink' } ]
        }
    }

    function gotoMeetingDetails(meeting){
        navigate("/meetingDetails", { state : { meeting, role, timeZone, previous } })
    }

    function stopPropagate(e){
        e.stopPropagation()
    }

    async function changeStatus(e, index){
        changeLabel(styles[e.target.value]["status"], index)
        const res = await markStatus(styles[e.target.value]["status"], id)
    }
    return (
        <div onClick = {() => gotoMeetingDetails(meeting)} className="meeting">
            <p>{meeting.type}</p>
            <p>{new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
            {meeting.labels ? 
            
            <p>status: <span>
                {/* {meeting.labels[0].name} */}
            <select onClick={stopPropagate} style={styles[meeting.labels[0].name]} className="status-select" onChange={(e) => {changeStatus(e, index)}}>
                {
                    Object.keys(styles).map((option, i) => {
                        return option !== "unavailable" && <option className = "select-option" key={i} style={styles[option]} value={option} >{option}</option>
                    })
                }
     
            </select></span></p>
            :
            <p>status: <span>Scheduled<select onChange={(e) => {changeStatus(e, index)}} style={styles.unavailable} className="status-select">
                {
                    Object.keys(styles).map((option, i) => {
                        return option !== "unavailable" && <option className = "select-option" key={i} style={styles[option]} value={option} >{option}</option> 
                    })
                }
                  
            </select></span></p>}

            {!previous && <p className="meeting-links"><a href={meeting.location.slice(5, meeting.location.indexOf(" ", 5))} target="_blank">Join Meeting</a></p>}
        </div>
    )
}