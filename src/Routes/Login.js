import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/Login.css"
import { loginUser } from "../apiCalls/apiCalls"

export default function Login(){
    
    const [ email, setEmail ] = useState("")
    const [ role, setRole ] = useState("student")
    const navigate = useNavigate()

    function changeEmail(e){
        setEmail(e.target.value)
    }

    function changeRole(e){
        setRole(e.target.value)
    }

    async function login(e){
        e.preventDefault()
        localStorage.setItem("email", email)
        localStorage.setItem("role", role)
        //const response = await loginUser(email, role)
        navigate("/dashboard")
    }

    return (
        <section className="login-section">
            <form className="login-form" onSubmit={login}>
                <h1>Login</h1>
                <div className="login-input-div">
                <label>Email:</label>
                <input className="login-input" type="email" value={email} onChange={changeEmail} required />
                </div>
                <div className="login-input-div">
                <label>Role:</label>
                <select className="login-input" value={role} onChange={changeRole}>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                </select>
                </div>
                <input className="submit-login" type="submit" />
            </form>
        </section>
    )
}