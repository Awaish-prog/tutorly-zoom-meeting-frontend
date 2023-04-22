import { useState } from "react"
import Menu from "../Components/Menu"
import crypto from 'crypto-js'
import "../CSS/Dashboard.css"
import "../CSS/Login.css"


export default function CheckStudentId(){

    const [ studentEmail, setStudentEmail ] = useState("")
    const [ id, setId ] = useState("")

    function calculateId(e){
        e.preventDefault()
        const hmac = crypto.HmacSHA1(studentEmail, "dskfrdsjgk");
        const hash = hmac.toString(crypto.enc.Hex);
        setId(hash.substring(0, 10));
    }


    return (
        <div className="dashboard">
            <Menu />
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