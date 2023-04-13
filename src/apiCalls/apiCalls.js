const url = "http://localhost:4005/"

async function getPreviousMeetings(email, role){
    const response = await fetch(`${url}getPreviousMeetings/${email}/${role}`)
    return await response.json()
}

async function getUpcomingMeetings(email, role){
    const response = await fetch(`${url}getUpcomingMeetings/${email}/${role}`)
    return await response.json()
}

async function getAvailability(date, apId){
    console.log(apId);
    const response = await fetch(`${url}getAvailabilty?date=${date}&appointmentTypeID=${apId}`)
}

export { getPreviousMeetings, getUpcomingMeetings, getAvailability }