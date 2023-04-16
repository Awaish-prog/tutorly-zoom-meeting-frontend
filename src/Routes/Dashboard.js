import { useState } from "react";
import Menu from "../Components/Menu";
import "../CSS/Dashboard.css"

function Dashboard(){
    const SHEET_ID = '1-wqELarzcQLs8bPNVC_kUiWZMCX6QPX9Acr3rjRov2k';
const ACCESS_TOKEN = 'ya29.a0Ael9sCP33WvUr3n3koSmx38aVQn-hglZN5GqBcOanEaK5paCi9vMLoHzn1hFqVUzciNoxZbXrY5fAh4CZ022D16u9h9mvNegFS6ZViKCLVZctps8IlV5PPcshPwHLPy0JKeoxGimZQWwdrv6gedvwjVzEPWmaCgYKAdgSARESFQF4udJhpm9ymd0IPqxSvazOcvbocA0163';


    const getSheetValues = async () =>{
        const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:B15`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`  
        }
        });
        const data = await request.json();
        console.log(data);
        return data;
      }
    
      getSheetValues()

    return <div className="dashboard">
        <Menu />
        <h1>Welcome</h1>
        
    </div>
}

export default Dashboard