import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getPreviousMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"

export default function PreviousMeetings(){

    const [ meetings, setMeetings ] = useState([])

    async function getPreviousMeetingsList(){
        const response = await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"))
        setMeetings(response.meetings)
    }

    useEffect(() => {
        getPreviousMeetingsList()
    }, [])

    return (
        <>
            <Menu />
            <Meetings meetings={meetings} role={localStorage.getItem("role")} previous={true} />
        </>
    )
}