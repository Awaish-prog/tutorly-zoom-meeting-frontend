import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getUpcomingMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"

export default function UpcomingMeetings(){
    
    const [ meetings, setMeetings ] = useState([])

    async function getUpcomingMeetingsList(){
        const response = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"))
        setMeetings(response.meetings)
    }

    useEffect(() => {
        getUpcomingMeetingsList()
    }, [])

    return (
        <>
            <Menu />
            <Meetings meetings={meetings} />
        </>
    )
}