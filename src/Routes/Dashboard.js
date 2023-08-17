import { useEffect, useState } from "react";
import Menu from "../Components/Menu";
import "../CSS/Dashboard.css"
import "../CSS/WhiteBoards.css"
import { getDashboardDatafromServer, getUpcomingMeetings } from "../apiCalls/apiCalls";
import callUs from "../Images/callUs.png"
import folder from "../Images/folder.png"
import keyTakeaways from "../Images/keyTakeaways.png"
import key from "../Images/key.png"
import doc from "../Images/doc.png"
import Meeting from "../Components/Meeting";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";
import cellPhoneIcon from "../Images/cellPhoneicon.png" 
import ixlLogin from "../Images/ixlLogin.png"

function Dashboard({ notify, updateNotification }){
    
    const [ dashboardData, setDashboardData ] = useState("")
    const [ dashboardUpcomingMeetings, setDashboardUpcomingMeetings ] = useState([])
    const [ meetingLoader, setMeetingLoader ] = useState(true)
    const [ showLoader, setShowLoader ] = useState(true)
    const navigate = useNavigate()
    const role = localStorage.getItem("role")
    const email = localStorage.getItem("email")

    async function getDashboardData(){
        const dashboardData = await getDashboardDatafromServer(email)
        dashboardData.status === 200 && setDashboardData(dashboardData)
        setShowLoader(false)
        const response1 = await getUpcomingMeetings(email, role, 50)
        response1.status === 200 && setDashboardUpcomingMeetings(response1.meetings)
        setMeetingLoader(false)
    }

    function gotoStudentData(student){
        navigate("/dashboardTutor", {state : { email: student[1]} })
    }
    
      

    useEffect(() => {
        if(!localStorage.getItem("email")){
            navigate("/", { replace: true })
        }
        getDashboardData()
    }, [])

    console.log(dashboardData.ixlCredentials);
    return <div className="dashboard">
        <Menu notify = {notify} updateNotification = {updateNotification} />
        {   
            role === "tutor" ?
            showLoader ? 
            <div className="loader-container"><Loader size={100} /></div> :
            dashboardData !== "" ?
            <div className="list-of-students">
            <h1>Welcome, {email.substring(0, 1).toUpperCase() + email.substring(1, email.indexOf("@"))}</h1>
            <div className="newBoardButtonContainer">
            {localStorage.getItem('role') === "tutor" && <a href="https://www.notion.so/mytutorly/Tutorly-s-Tutor-Wiki-3210fef0cccd4e10a1f1f692316c6116" target="_blank"><button className="newBoardButton">Tutorly's Tutor Wiki</button></a>}
            </div>
            <h2>List of Students</h2>
            {dashboardData.studentsList.length ? <div className="student-list-container">
            {
                dashboardData.studentsList.sort().map((student, index) => {
                    return <p key={index} className="student-name" onClick={() => gotoStudentData(student)}>{student[0]}</p>
                })
            }
            </div> : <h3>List of students is not available either you don't have any students yet or data of your students is not present in our database.</h3>}
            <div className="dashboard-upcoming-meetings">
                <h2>Upcoming meetings</h2>
                {
                    meetingLoader ?
                    <Loader size={50} /> :
                    dashboardUpcomingMeetings.length ?
                    <div className="dashboard-upcoming-meetings-list-tutor">
                        {
                            dashboardUpcomingMeetings.slice(0, 2).map((dashboardUpcomingMeeting, index) => {
                                return <Meeting key={index} meeting={dashboardUpcomingMeeting} role={role} previous={false} timeZone={{ timeZone: 'PST' }} />
                            })
                        }
                    </div> :
                    <h3>You don't have any upcoming meetings</h3>
                }
            </div>
            </div>
             :
            <h1 className="meeting-message">Dashboard data is not available for tutors</h1> :
            showLoader ? 
            <div className="loader-container"><Loader size={100} /></div> :
            dashboardData !== "" ? <div className="dashboard-container"><h1>Welcome, {dashboardData.dashboardData[0]}</h1>
            <div className="dashboard-content">
            <div className="key-takeaways">

            <div className="dashboard-options no-hover">
            {/* <img className="dashboard-logos" src={keyTakeaways} alt="key takeaways" /> */}
            <p>📝</p>
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
            {
                dashboardData.ixlCredentials && <>
                    <hr></hr>
            <div className="dashboard-options no-hover">
            {/* <img className="dashboard-logos" src={keyTakeaways} alt="key takeaways" /> */}
            <p>📝</p>
            <p>IXL Login Info</p>
            </div>

            <a className="dashboard-links" href="https://in.ixl.com/?partner=google&campaign=248380048&adGroup=129630696407&gclid=CjwKCAjwyqWkBhBMEiwAp2yUFpbcijZ9CHdTkgaIOPjK81jzxXk8Km1tge8iziC2Dw1plGJGB4hgqRoCqgkQAvD_BwE" target="_blank">
            <div className="dashboard-options">
            {/* <img className="dashboard-logos" src={ixlLogin} alt="doc" /> */}
            <p>💻</p>
            <p>Login to IXL</p>
            </div></a>

            <div className="dashboard-options no-hover">
            {/* <img className="dashboard-logos" src={key} alt="key takeaways" /> */}
            <p>⌨️</p>
            <p>Your credentials
                <br></br>
                <hr></hr>
                Username: {dashboardData.ixlCredentials.userName}
                <br></br>
                <hr></hr>
                Password: {dashboardData.ixlCredentials.password}
            </p>
            </div>
                </>
            }
            
            </div>

            

            <div className="session-details">

            <div className="dashboard-options no-hover">
            <img className="dashboard-logos" src={callUs} alt="call us" />
            <p>Message the Tutorly Team or Your Tutor: <a href="tel:19478887044">(947) 888-7044</a></p>
            </div>
            <a className="dashboard-links" href={`https://drive.google.com/drive/folders/${dashboardData.dashboardData[4]}`} target="_blank">
            <div className="dashboard-options">
            <img className="dashboard-logos" src={folder} alt="folder" />
            <p>Homework Folder</p>
            </div>
            </a>
            <div className="dashboard-options no-hover">
            <img className="dashboard-logos" src={cellPhoneIcon} alt="folder" />
            <p>Text: (947) 888-7044 (To send homework photos)</p>
            </div>
            {/* <ul className="dashboard-options">
                <li></li>
            </ul> */}

            <a className="dashboard-links" href={`https://drive.google.com/drive/folders/${dashboardData.dashboardData[44]}`}  target="_blank">
            <div className="dashboard-options">
            <img className="dashboard-logos" src={folder} alt="folder" />
            <p>Resources Folder</p>
            </div>
            </a>
            <a className="dashboard-links" href={`https://drive.google.com/drive/folders/${dashboardData.dashboardData[15]}`}  target="_blank">
            <div className="dashboard-options">
            <img className="dashboard-logos" src={folder} alt="folder" />
            <p>Session Recordings</p>
            </div>
            </a>

            
            </div>
            </div>

            
            <div className="dashboard-upcoming-meetings">
                <h2 className="dashboard-upcoming-meetings-heading">Upcoming meetings</h2>
                {
                    meetingLoader ?
                    <div className="dashboard-upcoming-meetings-list">
                    <Loader size={50} />
                    </div> :
                    dashboardUpcomingMeetings.length ?
                    <div className="dashboard-upcoming-meetings-list">
                        {
                            dashboardUpcomingMeetings.slice(0, 2).map((dashboardUpcomingMeeting, index) => {
                                return <Meeting key={index} meeting={dashboardUpcomingMeeting} role={role} previous={false} timeZone={{ timeZone: 'PST' }} />
                            })
                        }
                    </div> :
                    <div className="dashboard-upcoming-meetings-list">
                    <h3>You don't have any upcoming meetings</h3>
                    </div>
                }
            </div>
                
            
            </div> :
            <h1 className="meeting-message">Dashboard data is not available</h1>
        }
        
    </div>
}

export default Dashboard