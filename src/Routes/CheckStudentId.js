import { useState } from "react"
import Menu from "../Components/Menu"
import crypto from 'crypto-js'

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
        <>
            <Menu />
            <div>
                {
                    id && <p>{id}</p>
                }

                <form onSubmit={calculateId}>
                    <label>Email: </label>
                    <input type="email" onChange={(e) => setStudentEmail(e.target.value)} value={studentEmail} />
                    <input type="submit" />
                </form>
            </div>
        </>
    )
}