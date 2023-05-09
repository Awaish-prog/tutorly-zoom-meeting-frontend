import { Link, useNavigate } from "react-router-dom";
import "../CSS/Meetings.css";
import tutorlyLogo from "../Images/logo1.png"
import "../CSS/Menu.css"
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";


export default function Menu(){

    const email = localStorage.getItem("email") ? localStorage.getItem("email").toLowerCase() : "email"
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    function logout(){
        localStorage.removeItem("email")
        localStorage.removeItem("role")
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
    <>
        <div className="menu">
            <div className="logo-div">
                <img src = {tutorlyLogo} alt="Logo" width="200px" />
            </div>
            <ul className="menu-options">
                <Link className="link" to="/dashboard"><li>Dashboard</li></Link>
                <Link className="link" to="/previousMeetings"><li>Previous Meetings</li></Link>
                <Link className="link" to="/upcomingMeetings"><li>Upcoming Meetings</li></Link>
                {
                    (email === "awaish@tutorly.com" ||
                    email === "awaish@mytutorly.com" ||
                    email === "narinder@tutorly.com" ||
                    email === "narinder@mytutorly.com") &&
                    <Link className="link" to="/checkLoginId"><li>Check Login Id</li></Link>
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
                <Link onClick={() => setOpen(false)} className="link" to="/dashboard"><li>Dashboard</li></Link>
                <Link onClick={() => setOpen(false)} className="link" to="/previousMeetings"><li>Previous Meetings</li></Link>
                <Link onClick={() => setOpen(false)} className="link" to="/upcomingMeetings"><li>Upcoming Meetings</li></Link>
                {
                    (email === "awaish@tutorly.com" ||
                    email === "awaish@mytutorly.com" ||
                    email === "narinder@tutorly.com" ||
                    email === "narinder@mytutorly.com") &&
                    <Link className="link" to="/checkLoginId"><li>Check Login Id</li></Link>
                }
                <li><button className="logout" onClick={logout}>Logout</button></li>
            </ul>
            </div>
        </Drawer>
    </>
    )
}