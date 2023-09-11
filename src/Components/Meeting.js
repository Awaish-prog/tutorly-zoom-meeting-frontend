import { useNavigate } from "react-router-dom"
import "../CSS/Meetings.css"
import { markStatus } from "../apiCalls/apiCalls"
import { useEffect, useState } from "react"


export default function Meeting({ meeting, role, previous, timeZone, changeLabel, index, id
 }){
    const navigate = useNavigate()

    const [ options, setOptions ] = useState([])

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
        },
        "Excused Absence" : {
            status: [{id: 12763262, name: "Excused Absence", color: "yellow"}],
            color: "white",
            backgroundColor: '#9c7f06',
            padding: '5px 10px',
            borderRadius: '10px',
        }
    }

    function gotoMeetingDetails(meeting){
        navigate("/meetingDetails", { state : { meeting, role, timeZone, previous } })
    }

    function stopPropagate(e){
        e.stopPropagation()
    }

    async function changeStatus(e, index){
        if(!styles[e.target.value]){
            return
        }
        changeLabel(styles[e.target.value]["status"], index)
        const res = await markStatus(styles[e.target.value]["status"], id)
    }

    useEffect(() => {
        if(meeting.labels){
            setOptions((prev) => {
                const newOptions = [...prev]
                newOptions.push(meeting.labels[0].name)
                const keys = Object.keys(styles)
                for(let i = 0; i < keys.length; i++){
                    if(keys[i] !== meeting.labels[0].name && keys[i] !== "unavailable"){
                        newOptions.push(keys[i])
                    }
                }
                return newOptions
            })
        }
        else{
            setOptions((prev) => {
                const newOptions = [...prev]
                newOptions.push("Scheduled")
                const keys = Object.keys(styles)
                for(let i = 0; i < keys.length; i++){
                    if(keys[i] !== "unavailable"){
                        newOptions.push(keys[i])
                    }
                    
                }
                return newOptions
            })   
        }
    }, [])
    
    return (
        <div onClick = {() => gotoMeetingDetails(meeting)} className="meeting">
            <p>{meeting.type}</p>
            <p>{new Date(meeting.datetime).toLocaleString('en-US', timeZone)}</p>
            {meeting.labels ? 
            
            <p>status: <span>
                {/* {meeting.labels[0].name} */}
            <select onClick={stopPropagate} style={styles[meeting.labels[0].name]} className="status-select" onChange={(e) => {changeStatus(e, index)}}>
                {
                    options.map((option, i) => {
                        return option !== "unavailable" && <option className = "select-option" key={i} style={styles[option]} value={option} >{option}</option>
                    })
                }
     
            </select></span></p>
            :
            <p>status: <span><select onClick={stopPropagate} onChange={(e) => {changeStatus(e, index)}} style={styles.unavailable} className="status-select">
                {
                    options.map((option, i) => {
                        return option !== "unavailable" && <option className = "select-option" key={i} style={styles[option]} value={option} >{option}</option> 
                    })
                }
                  
            </select></span></p>}

            {!previous && <p className="meeting-links"><a href={meeting.location.slice(5, meeting.location.indexOf(" ", 5))} target="_blank">Join Meeting</a></p>}
        </div>
    )
}