import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getUpcomingMeetings } from "../apiCalls/apiCalls"

export default function UpcomingMeetings(){
    
    const [ meetings, setMeetings ] = useState([])

    async function getUpcomingMeetingsList(){
        await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"))
    }

    useEffect(() => {
        getUpcomingMeetingsList()
    }, [])

    return (
        <>
            <Meetings meetings={meetings} role={localStorage.getItem("role")} />
        </>
    )
}