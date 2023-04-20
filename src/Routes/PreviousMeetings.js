import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getPreviousMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"
import "../CSS/Meetings.css"

export default function PreviousMeetings(){

    const [ meetings, setMeetings ] = useState([])

    async function getPreviousMeetingsList(number){
        const response = await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"), number)
        setMeetings(response.meetings)
        
    }

    useEffect(() => {
        if(meetings.length >= 50){
            getPreviousMeetingsList(2147483647)
        }
    }, [meetings])

    useEffect(() => {
        getPreviousMeetingsList(50)
    }, [])

    return (
        <div className="meetings">
            <Menu />
            <Meetings meetings={meetings} role={localStorage.getItem("role")} previous={true} />
        </div>
    )
}