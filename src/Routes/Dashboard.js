import { useEffect, useState } from "react";
import Menu from "../Components/Menu";
import "../CSS/Dashboard.css"
import { getDashboardDatafromServer, getPreviousMeetings, getUpcomingMeetings } from "../apiCalls/apiCalls";
import callUs from "../Images/callUs.png"
import folder from "../Images/folder.png"
import keyTakeaways from "../Images/keyTakeaways.png"
import doc from "../Images/doc.png"
import Meeting from "../Components/Meeting";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";

function Dashboard(){
    
    const [ dashboardData, setDashboardData ] = useState("")
    const [ dashboardUpcomingMeetings, setDashboardUpcomingMeetings ] = useState([])
    const [ meetingLoader, setMeetingLoader ] = useState(true)
    const [ showLoader, setShowLoader ] = useState(true)
    const navigate = useNavigate()
    const role = localStorage.getItem("role")


    async function getDashboardData(){
        if(role === "tutor"){
            return
        }
        const email = localStorage.getItem("email")
        const dashboardData = await getDashboardDatafromServer(email)
        dashboardData.status === 200 && setDashboardData(dashboardData)
        setShowLoader(false)
        const response1 = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 50)
        response1.status === 200 && setDashboardUpcomingMeetings(response1.meetings)
        setMeetingLoader(false)
    }
    
      

    useEffect(() => {
        if(!localStorage.getItem("email")){
            navigate("/", { replace: true })
        }
        getDashboardData()
    }, [])


    return <div className="dashboard">
        <Menu />
        {   
            role === "tutor" ?
            <h1 className="meeting-message">Dashboard data is not available for tutors</h1> :
            showLoader ? 
            <div className="loader-container"><Loader size={100} /></div> :
            dashboardData !== "" ? <div className="dashboard-container"><h1>Welcome, {dashboardData.dashboardData[0]}</h1>
            <div className="dashboard-content">
            <div className="key-takeaways">

            <div className="dashboard-options">
            <img className="dashboard-logos" src={keyTakeaways} alt="key takeaways" />
            <p>View Your Key Takeaways</p>
            </div>

            {
                dashboardData.files.map((file, index) => {
                    return  file.name.toLowerCase().includes("key") && <a className="dashboard-links" key={index} href={`https://docs.google.com/document/d/${file.id}`} target="_blank">
                        <div className="dashboard-options">
                        <img className="dashboard-logos" src={doc} alt="doc" />
                        <p>{file.name}</p>
                        </div></a>
                })
            }
            </div>

            <div className="session-details">

            <div className="dashboard-options">
            <img className="dashboard-logos" src={callUs} alt="call us" />
            <p>Message the Tutorly Team or Your Tutor: <a className="dashboard-links" href="tel:19478887044">(947) 888-7044</a></p>
            </div>

            <div className="dashboard-options">
            <img className="dashboard-logos" src={folder} alt="folder" />
            <p><a className="dashboard-links" href={`https://drive.google.com/drive/folders/${dashboardData.dashboardData[4]}`} target="_blank">Homework Folder</a></p>
            </div>


            <div className="dashboard-options">
            <img className="dashboard-logos" src={folder} alt="folder" />
            <p><a className="dashboard-links" href={`https://drive.google.com/drive/folders/${dashboardData.dashboardData[44]}`}  target="_blank">Resources Folder</a></p>
            </div>

            <div className="dashboard-options">
            <img className="dashboard-logos" src={folder} alt="folder" />
            <p><a className="dashboard-links" href={`https://drive.google.com/drive/folders/${dashboardData.dashboardData[15]}`}  target="_blank">Session Recordings</a></p>
            </div>
            <ul>
                <li>Remember to upload homework before each session by texting (947) 888-7044!</li>
            </ul>
            </div>
            </div>

            
            <div className="dashboard-upcoming-meetings">
                <h2>Upcoming meetings</h2>
                {
                    meetingLoader ?
                    <Loader size={50} /> :
                    dashboardUpcomingMeetings.slice(0, 2).map((dashboardUpcomingMeeting, index) => {
                        return <Meeting key={index} meeting={dashboardUpcomingMeeting} role={role} previous={false} timeZone={{ timeZone: 'PST' }} />
                    })
                }
            </div>
                
            
            </div> :
            <h1 className="meeting-message">Dashboard data is not available</h1>
        }
        
    </div>
}

export default Dashboard