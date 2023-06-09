const url = "/"

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

export { getPreviousMeetings, getUpcomingMeetings, getAvailability, rescheduleMeetingWithTime, cancelAppointmentWithId, getDashboardDatafromServer, loginUser }