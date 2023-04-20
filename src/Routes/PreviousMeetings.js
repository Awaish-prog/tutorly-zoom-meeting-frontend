import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getPreviousMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"
import "../CSS/Meetings.css"

export default function PreviousMeetings(){

    const [ meetings, setMeetings ] = useState([])

    async function getPreviousMeetingsList(){
        const response1 = await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 50, 2147483647)
        setMeetings(response1.meetings)
        const response2 = await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 2147483647, 2147483647)
        setMeetings(response2.meetings)
        
    }

    useEffect(() => {
        getPreviousMeetingsList()
    }, [])

    return (
        <div className="meetings">
            <Menu />
            <Meetings meetings={meetings} role={localStorage.getItem("role")} previous={true} />
        </div>
    )
}