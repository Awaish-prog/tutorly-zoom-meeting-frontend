import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/Login.css"
import { loginUser } from "../apiCalls/apiCalls"
import Loader from "../Components/Loader"

export default function Login(){
    
    const [ email, setEmail ] = useState("")
    const [ role, setRole ] = useState("student")
    const [ id, setId ] = useState("")
    const [ showLoader, setShowLoader ] = useState(false)
    const [ message, setMessage ] = useState("")
    const navigate = useNavigate()

    function changeEmail(e){
        setEmail(e.target.value)
    }

    function changeRole(e){
        setRole(e.target.value)
    }

    function changeId(e){
        setId(e.target.value)
    }

    async function login(e){
        e.preventDefault()
        setShowLoader(true)
        localStorage.setItem("email", email.toLowerCase())
        localStorage.setItem("role", role)
        const response = await loginUser(email.toLowerCase(), role, id)
        localStorage.setItem("token", response.token)
        setShowLoader(false)
        response.status === 200 ? navigate("/dashboard", { replace: true }) : response.status === 400 ? setMessage("wrong password") : setMessage("This email was not found, please check the email and the role you selected");
    }

    return (
        <section className="login-section">
            {
                showLoader ?
                <Loader size = {50} /> :
                <>
                    <form className="login-form" onSubmit={login}>
                        <h1>Login</h1>
                        
                        <div className="login-input-div">
                        <label>Email:</label>
                        <input className="login-input" type="email" value={email} onChange={changeEmail} required />
                        </div>
                        <div className="login-input-div">
                        <label>Id:</label>
                        <input className="login-input" type="text" value={id} onChange={changeId} required />
                        </div>
                        <div className="login-input-div">
                        <label>Role:</label>
                        <select className="login-input" value={role} onChange={changeRole}>
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                        </select>
                        </div>
                        {message && <p className="error-message">{message}</p>}
                        <input className="submit-login" type="submit" value="Login" />
                    </form>
                </>
            } 
        </section>
    )
}