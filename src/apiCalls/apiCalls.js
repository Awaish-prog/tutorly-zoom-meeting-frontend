const url = "http://localhost:4005/"

async function getPreviousMeetings(email, role, number){
    const response = await fetch(`${url}getPreviousMeetings/${email}/${role}/${number}`)
    return await response.json()
}

async function getUpcomingMeetings(email, role, number){
    const response = await fetch(`${url}getUpcomingMeetings/${email}/${role}/${number}`)
    return await response.json()
}

async function getAvailability(date, apId){
    const response = await fetch(`${url}getAvailabilty?date=${date}&appointmentTypeID=${apId}`)
    return await response.json()
}

async function rescheduleMeetingWithTime(datetime, id){
    const response = await fetch(`${url}rescheduleMeeting`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            datetime, id
        })
    })
    return await response.json()
}

async function cancelAppointmentWithId(id){
    const response = await fetch(`${url}cancelMeeting`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            id
        })
    })
    return await response.json()
}

async function getDashboardDatafromServer(email){
    const response = await fetch(`${url}getDashboardData/${email}`)
    return await response.json()
}

async function loginUser(email, role){
    const response = await fetch(`${url}login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            email, role
        })
    })
    return await response.json()
}

export { getPreviousMeetings, getUpcomingMeetings, getAvailability, rescheduleMeetingWithTime, cancelAppointmentWithId, getDashboardDatafromServer, loginUser }