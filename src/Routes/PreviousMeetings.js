import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"

export default function PreviousMeetings(){

    const [ meetings, setMeetings ] = useState([])

    useEffect(() => {
        
    }, [])

    return (
        <>
            <Meetings meetings={meetings} role={localStorage.getItem("role")} />
        </>
    )
}