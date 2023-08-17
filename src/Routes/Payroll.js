import { useState } from "react";
import Menu from "../Components/Menu";
import "../CSS/Payroll.css"
import { getPayroll } from "../apiCalls/apiCalls";
import TableComponent from "../Components/TableComponent";
import Loader from "../Components/Loader";

export default function Payroll({ notify, updateNotification }){

    const [ from, setFrom ] = useState("")
    const [ to, setTo ] = useState("")
    const [ message, setMessage ] = useState("")
    const [ pay, setPay ] = useState(0)
    const [ appointments, setAppointments ] = useState([])
    const [ loader, setLoader ] = useState(false)

    function changeFrom(e){
        setFrom(e.target.value)
    }
    
    function changeTo(e){
        setTo(e.target.value)
    }

    async function submitForm(e){
        e.preventDefault()
        setLoader(true)
        setPay(0)
        setMessage("")
        setAppointments([])

        if(to === "" || from === ""){
            setMessage("Please select From and To dates")
            setLoader(false)
            return
        }
        if(to < from){
          setMessage("To date should be after From date")
          setLoader(false)
          return
        }
        
        
        
        const res = await getPayroll(from, to)
        
        if(res.status === 200){
            res.appointments.length === 0 && setMessage("You did not have any tutoring sessions from " + from + " to " + to)
            setAppointments(res.appointments)
            let pay = 0
            const appointments = res.appointments
            for(let i = 0; i < appointments.length; i++){
                pay += (Number(appointments[i].duration) / Number(appointments[i].type.toLowerCase().includes("lala") ? 50 : (appointments[i].type.toLowerCase().includes("maple tutoring") ? 35 : 60))) * Number(appointments[i].category.toLowerCase().includes("person") ? 50 : 25)
            }
            setPay(pay)
        } 
        setFrom("")
        setTo("")
        setLoader(false)
      }

    return <div className="payroll">
        <Menu notify = {notify} updateNotification = {updateNotification} />
        <div>
            <h1>Payroll</h1>
            <form className="payroll-form" onSubmit={submitForm}>
                <div>
                    <label>From: </label>
                    <input type="date" value={from} onChange={changeFrom} placeholder="mm/dd/yy" />
                </div>
                <div>
                    <label>To: </label>
                    <input type="date" value={to} onChange={changeTo} placeholder="mm/dd/yy" />
                </div>
                {loader ? <Loader size = {40} /> : <input className="submit" type="submit" />}
            </form>
            { pay !== 0 && <h2>Total Pay: {pay.toFixed(2)}</h2> }
            { message !== "" && <h2>{message}</h2> }
            {appointments.length !== 0 && <div className = "table-container">
                 <TableComponent data = {appointments} />
            </div>}
        </div>
    </div>
}