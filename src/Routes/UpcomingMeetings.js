import { useEffect, useState } from "react"
import Meetings from "../Components/Meetings"
import { getUpcomingMeetings } from "../apiCalls/apiCalls"
import Menu from "../Components/Menu"
import "../CSS/Meetings.css"
import Loader from "../Components/Loader"
import { useNavigate } from "react-router-dom"


export default function UpcomingMeetings(){
    
    const [ meetings, setMeetings ] = useState([])
    const [ showLoader, setShowLoader ] = useState(true)
    const navigate = useNavigate()

    async function getUpcomingMeetingsList(){
        const response1 = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 50)
        setMeetings(response1.meetings)
        setShowLoader(false)
        const response2 = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 2147483647)
        setMeetings(response2.meetings)
    }

    function changeLabel(label, index){
        setMeetings((prev) => {
            const newMeetings = [...prev]
            newMeetings[index]["labels"] = label
            return newMeetings
        })
    }
    

    useEffect(() => {
        if(!localStorage.getItem("email")){
            navigate("/", { replace: true })
        }
        getUpcomingMeetingsList()
    }, [])

    return (
        <div className="meetings">
            <Menu />
            {
                showLoader ? 
                <div className="loader-container"><Loader size={100} /></div> :
                meetings.length === 0 ? 
                <h1 className="meeting-message">You don't have any upcoming meetings</h1> :
                <Meetings meetings={meetings} role={localStorage.getItem("role")} previous={false} changeLabel = {changeLabel} />
            }
        </div>
    )
}