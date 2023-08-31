import { Link, useNavigate } from "react-router-dom";
import "../CSS/Meetings.css";
import tutorlyLogo from "../Images/logo1.png"
import "../CSS/Menu.css"
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { url } from "../apiCalls/apiCalls";


export default function Menu({ notify, updateNotification, setNotification }){

    const email = localStorage.getItem("email") ? localStorage.getItem("email").toLowerCase() : "email"
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    function logout(){
        localStorage.removeItem("email")
        localStorage.removeItem("role")
        localStorage.removeItem("token")
        navigate("/")
    }

    function updateNotificationTrigger(){
        updateNotification()
    }

    useEffect(() => {
        if(!window.location.href.toLowerCase().endsWith("slack")){
            updateNotification()
        }

        const socket = io("https://app.tutorly.com/"); 

        socket.on("sendNotification", () => {
        
            if(!window.location.href.toLowerCase().endsWith('slack')){
                if(setNotification){
                    setNotification(true)
                }
            }
            
        })

        return () => {
            socket.off("sendNotification")
        }
        
    }, [])

    return (
    <>
        <div className="menu">
            <div className="logo-div">
                <img src = {tutorlyLogo} alt="Logo" width="200px" />
            </div>
            <ul className="menu-options">
                <Link className="link" to="/dashboard"><li onClick={updateNotificationTrigger}>Dashboard</li></Link>

                <Link className="link" to="/previousMeetings"><li onClick={updateNotificationTrigger}>Previous Meetings</li></Link>

                <Link className="link" to="/upcomingMeetings"><li onClick={updateNotificationTrigger}>Upcoming Meetings</li></Link>

                {localStorage.getItem("role") === "tutor" && <Link className="link" to="/payroll"><li onClick={updateNotificationTrigger}>Payroll</li></Link>}

                <Link className="link" to="/whiteboards"><li onClick={updateNotificationTrigger}>Whiteboards</li></Link>

                

                {
                    (email.toLowerCase().includes("tutorly")) &&
                    <>
                    <Link className="link" to="/slack"><li className="slack-menu" >Slack {notify && <div className="unread-dot-menu"></div>}</li></Link>
                    <Link className="link" to="/checkLoginId"><li onClick={updateNotificationTrigger}>Check Login Id</li></Link>
                    </>
                }

                <li><button className="logout" onClick={logout}>Logout</button></li>
            </ul>
        </div>
        <div className="menu-bar-container">
        <img src = {tutorlyLogo} alt="Logo" />
        <div className="menu-bar" onClick={() => setOpen(true)}>
            <MenuIcon />
        </div>
        </div>
        
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} >
            <div className="menu-mobile">
            <div className="logo-div-mobile">
                <img src = {tutorlyLogo} alt="Logo" />
                <span className="close-button"><CloseIcon onClick={() => setOpen(false)} /></span>
            </div>
            <ul className="menu-options">
                <Link onClick={() => setOpen(false)} className="link" to="/dashboard"><li onClick={updateNotificationTrigger}>Dashboard</li></Link>

                <Link onClick={() => setOpen(false)} className="link" to="/previousMeetings"><li onClick={updateNotificationTrigger}>Previous Meetings</li></Link>

                <Link onClick={() => setOpen(false)} className="link" to="/upcomingMeetings"><li onClick={updateNotificationTrigger}>Upcoming Meetings</li></Link>

                {localStorage.getItem("role") === "tutor" && <Link onClick={() => setOpen(false)} className="link" to="/payroll"><li onClick={updateNotificationTrigger}>Payroll</li></Link>}

                <Link className="link" to="/whiteboards"><li onClick={updateNotificationTrigger}>Whiteboards</li></Link>

                

                {
                    (email.toLowerCase().includes("tutorly")) &&
                    <>
                    <Link className="link" to="/slack"><li className="slack-menu" >Slack {notify && <div className="unread-dot-menu"></div>}</li></Link>
                    <Link className="link" to="/checkLoginId"><li onClick={updateNotificationTrigger}>Check Login Id</li></Link>
                    </>
                }

                <li><button className="logout" onClick={logout}>Logout</button></li>
            </ul>
            </div>
        </Drawer>
    </>
    )
}