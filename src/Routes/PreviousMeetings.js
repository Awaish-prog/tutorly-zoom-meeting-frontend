import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getPreviousMeetings } from "../apiCalls/apiCalls"

export default function PreviousMeetings(){

    const [ meetings, setMeetings ] = useState([])

    async function getPreviousMeetingsList(){
        await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"))
    }

    useEffect(() => {
        getPreviousMeetingsList()
    }, [])

    return (
        <>
            <Meetings meetings={meetings} role={localStorage.getItem("role")} />
        </>
    )
}