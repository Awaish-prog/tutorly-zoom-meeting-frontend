import { useEffect, useState } from "react";
import Menu from "../Components/Menu";
import "../CSS/Dashboard.css"
import { getDashboardDatafromServer } from "../apiCalls/apiCalls";

function Dashboard(){
    
    const [ dashboardData, setDashboardData ] = useState([])

    async function getDashboardData(){
      const email = localStorage.getItem("email")
      const dashboardData = await getDashboardDatafromServer(email)
      dashboardData.status === 200 && setDashboardData(dashboardData.dashboardData)
    }
    
      

    useEffect(() => {
        getDashboardData()
    }, [])


    return <div className="dashboard">
        <Menu />
        <h1>Welcome</h1>
        
    </div>
}

export default Dashboard