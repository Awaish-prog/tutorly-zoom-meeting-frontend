import { useEffect, useState } from "react"
import Menu from "../Components/Menu"
import crypto from 'crypto-js'
import "../CSS/Dashboard.css"
import "../CSS/Login.css"
import { useNavigate } from "react-router-dom"

export function getId(studentEmailForId){
    const hmac = crypto.HmacSHA1(studentEmailForId, "dskfrdsjgk");
    const hash = hmac.toString(crypto.enc.Hex);
    return hash.substring(0, 10)
}

export default function CheckStudentId({ notify, updateNotification, setNotification }){

    const [ studentEmail, setStudentEmail ] = useState("")
    const [ id, setId ] = useState("")
    const navigate = useNavigate()

    

    function calculateId(e){
        e.preventDefault()
        
        setId(getId(studentEmail));
    }

    useEffect(() => {
        if(!localStorage.getItem("email")){
            navigate("/", { replace: true })
        }
    }, [])

    return (
        <div className="dashboard">
            <Menu notify = {notify} updateNotification = {updateNotification} setNotification={setNotification} />
            <div className="dashboard-container">
                <h1>View Login Id</h1>

                {
                    id && <p>{id}</p>
                }

                <form className="login-form" onSubmit={calculateId}>
                    <div className="login-input-div">
                    <label>Email: </label>
                    <input className="login-input" type="email" onChange={(e) => setStudentEmail(e.target.value)} value={studentEmail} />
                    </div>
                    <input className="submit-login" type="submit" />
                </form>
            </div>
        </div>
    )
}