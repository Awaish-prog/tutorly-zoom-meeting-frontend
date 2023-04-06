const url = "http://localhost:4000/"

async function getPreviousMeetings(email, role){
    const response = await fetch(`${url}getPreviousMeetings/${email}/${role}`)
    return await response.json()
}

async function getUpcomingMeetings(email, role){
    const response = await fetch(`${url}getUpcomingMeetings/${email}/${role}`)
    return await response.json()
}

export { getPreviousMeetings, getUpcomingMeetings }