export default function Meetings({ meetings }){
    return (
        <>
            <table>
                <thead>
                    <tr>
                    <th>Tutor Name</th>
                    <th>Student Name</th>
                    <th>Title</th>
                    <th>Date and Time</th>
                    <th>Meeting Link</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        meetings.map((meeting, index) => {
                            return <tr key={index}>
                                <td>{meeting.calendar}</td>
                                <td>{`${meeting.firstName} ${meeting.lastName}`}</td>
                                <td>{meeting.type}</td>
                                <td>{`${meeting.date} ${meeting.time}`}</td>
                                <td>Link</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>
    )
}