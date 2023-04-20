import { useEffect, useState } from "react";
import Menu from "../Components/Menu";
import "../CSS/Dashboard.css"
import { getDashboardDatafromServer, getPreviousMeetings, getUpcomingMeetings } from "../apiCalls/apiCalls";
import callUs from "../Images/callUs.png"
import folder from "../Images/folder.png"
import joinSession from "../Images/joinSession.png"
import keyTakeaways from "../Images/keyTakeaways.png"
import doc from "../Images/doc.png"
import Meeting from "../Components/Meeting";

function Dashboard(){
    
    const [ dashboardData, setDashboardData ] = useState("")
    const role = localStorage.getItem("role")
    const [ dashboardUpcomingMeetings, setDashboardUpcomingMeetings ] = useState([])
    const [ dashboardPreviousMeetings, setDashboardPreviousMeetings ] = useState([])

    async function getDashboardData(){
        const email = localStorage.getItem("email")
        const dashboardData = await getDashboardDatafromServer(email)
        dashboardData.status === 200 && setDashboardData(dashboardData)
        const response1 = await getPreviousMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 20, 2)
        setDashboardPreviousMeetings(response1.meetings)
        const response2 = await getUpcomingMeetings(localStorage.getItem("email"), localStorage.getItem("role"), 20, 2)
        setDashboardUpcomingMeetings(response2.meetings)
    }
    
      

    useEffect(() => {
        getDashboardData()
    }, [])


    return <div className="dashboard">
        <Menu />
        {
            dashboardData !== "" && <div className="dashboard-container"><h1>Welcome, {dashboardData.dashboardData[0]}</h1>
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

            <div className="dashboard-meetings">
                <div className="dashboard-upcoming-meetings">
                    {
                        dashboardUpcomingMeetings.map((dashboardUpcomingMeeting, index) => {
                            return <Meeting key={index} meeting={dashboardUpcomingMeeting} role={role} previous={false} timeZone={{ timeZone: 'PST' }} />
                        })
                    }
                </div>
                <div className="dashboard-previous-meetings">
                    {
                        dashboardUpcomingMeetings.map((dashboardUpcomingMeeting, index) => {
                            return <Meeting key={index} meeting={dashboardUpcomingMeeting} role={role} previous={true} timeZone={{ timeZone: 'PST' }} />
                        })
                    }
                </div>
            </div>
            </div>
        }
        
    </div>
}

export default Dashboard