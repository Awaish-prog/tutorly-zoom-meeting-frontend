import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getUpcomingMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"
import "../CSS/Meetings.css"


export default function UpcomingMeetings(){
    
    const [ meetings, setMeetings ] = useState([])

    async function getUpcomingMeetingsList(number){
        const response = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"), number)
        setMeetings(response.meetings)
    }



    // useEffect(() => {
    //     if(meetings.length >= 50){
    //         getUpcomingMeetingsList(2147483647)
    //     }
    // }, [meetings])

    useEffect(() => {
        getUpcomingMeetingsList(50)
    }, [])

    return (
        <div className="meetings">
            <Menu />
            <Meetings meetings={meetings} role={localStorage.getItem("role")} previous={false} />
        </div>
    )
}