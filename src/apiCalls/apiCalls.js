const url = "http://localhost:4005/"

async function getPreviousMeetings(email, role, number){
    const token = localStorage.getItem("token")
    const response = await fetch(`${url}getPreviousMeetings/${email}/${role}/${number}`, {
        headers: {
            "token": token,
            "email": email
        }
    })
    return await response.json()
}

async function getUpcomingMeetings(email, role, number){
    const token = localStorage.getItem("token")
    const emailToken = localStorage.getItem("email")
    const response = await fetch(`${url}getUpcomingMeetings/${email}/${role}/${number}`, {
        headers: {
            "token": token,
            "email": emailToken
        }
    })
    return await response.json()
}



async function getAvailability(date, apId){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const response = await fetch(`${url}getAvailabilty?date=${date}&appointmentTypeID=${apId}`, {
        headers: {
            "token": token,
            "email": email
        }
    })
    return await response.json()
}

async function rescheduleMeetingWithTime(datetime, id){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const response = await fetch(`${url}rescheduleMeeting`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            datetime, id
        })
    })
    return await response.json()
}

async function cancelAppointmentWithId(id){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const response = await fetch(`${url}cancelMeeting`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            id
        })
    })
    return await response.json()
}

async function getDashboardDatafromServer(email, roleStudent){
    const token = localStorage.getItem("token")
    const role = roleStudent ? roleStudent : localStorage.getItem("role")
    const emailToken = localStorage.getItem("email")
    const response = await fetch(`${url}getDashboardData/${email}/${role}`, {
        headers: {
            "token": token,
            "email": emailToken
        }
    })
    return await response.json()
}

async function loginUser(email, role, id){
    const token = localStorage.getItem("token")
    const response = await fetch(`${url}login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            email, role, id
        })
    })
    return await response.json()
}

async function createWhiteboardData(paperName, paperLink, tutorEmail, studentEmail, dateAndTime, paperData){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const response = await fetch(`${url}createWhiteboardData`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            paperName, paperLink, tutorEmail, studentEmail, dateAndTime, paperData
        })
    })
    return await response.json()
}

async function createBitpaper(paperName, tutorEmail, studentEmail, dateAndTime){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const response = await fetch(`${url}createBitpaper`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            paperName, tutorEmail, studentEmail, dateAndTime
        })
    })
    return await response.json()
}

async function deleteBitpaper(paperid){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const response = await fetch(`${url}deleteBitpaper`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            paperid
        })
    })
    console.log(response);
}

async function getBoardsList(){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const role = localStorage.getItem("role")
    const response = await fetch(`${url}getBoardsList`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            email, role
        })
    })
    return await response.json()
}

async function deleteWhiteboard(paperLink){
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const role = localStorage.getItem("role")
    const response = await fetch(`${url}deleteWhiteboard`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "email": email
        },
        body : JSON.stringify({
            paperLink
        })
    })
    return await response.json()
}

export { getPreviousMeetings, getUpcomingMeetings, getAvailability, rescheduleMeetingWithTime, cancelAppointmentWithId, getDashboardDatafromServer, loginUser, createWhiteboardData, getBoardsList, deleteWhiteboard, createBitpaper, deleteBitpaper }