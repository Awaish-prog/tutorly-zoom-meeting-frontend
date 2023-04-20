import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getUpcomingMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"
import "../CSS/Meetings.css"


export default function UpcomingMeetings(){
    
    const [ meetings, setMeetings ] = useState([])

    async function getUpcomingMeetingsList(){
        const response1 = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 50, 2147483647)
        setMeetings(response1.meetings)
        const response2 = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 2147483647, 2147483647)
        setMeetings(response2.meetings)
    }
    

    useEffect(() => {
        getUpcomingMeetingsList()
    }, [])

    return (
        <div className="meetings">
            <Menu />
            <Meetings meetings={meetings} role={localStorage.getItem("role")} previous={false} />
        </div>
    )
}