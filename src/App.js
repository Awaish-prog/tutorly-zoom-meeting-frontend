import { Route, Routes} from "react-router-dom";
import Login from "./Routes/Login";
import UpcomingMeetings from "./Routes/UpcomingMeetings";
import PreviousMeetings from "./Routes/PreviousMeetings";
import MeetingDeatils from "./Routes/MeetingDetails";
import Dashboard from "./Routes/Dashboard";
import CheckStudentId from "./Routes/CheckStudentId";
import DashboardTutor from "./Routes/DashboardTutor";
import WhiteBoards from "./Routes/WhiteBoards";
import Payroll from "./Routes/Payroll";
import Slack from "./Routes/Slack";
import { useState } from "react";
import { updateNotificationApi } from "./apiCalls/apiCalls";

function App() {

  const [ notify, setNotify ] = useState(false)

  async function updateNotification(){
    const res = await updateNotificationApi()
    setNotify(res.notify)
  }

  return (
    <Routes>
      <Route path="/" element = { <Login /> } />
      <Route path="/dashboard" element = { <Dashboard notify = {notify} updateNotification = {updateNotification} /> } />
      <Route path="/upcomingMeetings" element = {<UpcomingMeetings notify = {notify} updateNotification = {updateNotification} />} />
      <Route path="/previousMeetings" element = {<PreviousMeetings notify = {notify} updateNotification = {updateNotification} />} />
      <Route path="/meetingDetails" element = {<MeetingDeatils notify = {notify} updateNotification = {updateNotification} />} />
      <Route path="/checkLoginId" element = {<CheckStudentId notify = {notify} updateNotification = {updateNotification} />} />
      <Route path="/dashboardTutor" element = {<DashboardTutor notify = {notify} updateNotification = {updateNotification} />} />
      <Route path="/whiteboards" element = {<WhiteBoards notify = {notify} updateNotification = {updateNotification} />} />
      <Route path="/payroll" element = {<Payroll notify = {notify} updateNotification = {updateNotification} />} />
      <Route path="/slack" element = {<Slack notify = {notify} updateNotification = {updateNotification} />} />
    </Routes>
  );
}

export default App;
