import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

    function login(e){
        e.preventDefault()
        localStorage.setItem("email", email)
        localStorage.setItem("role", role)
        navigate("/dashboard")
    }

    return (
        <>
            <form onSubmit={login}>
                <label>Email: </label>
                <input type="email" value={email} onChange={changeEmail} required />
                <label>Role: </label>
                <select value={role} onChange={changeRole}>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                </select>
                <input type="submit" />
            </form>
        </>
    )
}