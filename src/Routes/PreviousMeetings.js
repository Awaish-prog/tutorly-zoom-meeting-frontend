import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getPreviousMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"
import "../CSS/Meetings.css"
import Loader from "../Components/Loader"
import { useNavigate } from "react-router-dom"

export default function PreviousMeetings(){

    const [ meetings, setMeetings ] = useState([])
    const [ showLoader, setShowLoader ] = useState(true)
    const navigate = useNavigate()

    async function getPreviousMeetingsList(){
        const response1 = await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 50)
        response1.status === 200 && setMeetings(response1.meetings)
        setShowLoader(false)
        const response2 = await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 2147483647)
        response2.status === 200 && setMeetings(response2.meetings)
        
    }

    useEffect(() => {
        if(!localStorage.getItem("email")){
            navigate("/", { replace: true })
        }
        getPreviousMeetingsList()
    }, [])

    return (
        <div className="meetings">
            <Menu />
            {
                showLoader ? 
                <div className="loader-container"><Loader size={100} /></div> :
                meetings.length === 0 ? 
                <h1 className="meeting-message">You don't have any previous meetings</h1> :
                <Meetings meetings={meetings} role={localStorage.getItem("role")} previous={true} />
            }
        </div>
    )
}