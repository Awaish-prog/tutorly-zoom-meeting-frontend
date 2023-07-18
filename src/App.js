import { Route, Routes} from "react-router-dom";
import Login from "./Routes/Login";
import UpcomingMeetings from "./Routes/UpcomingMeetings";
import PreviousMeetings from "./Routes/PreviousMeetings";
import MeetingDeatils from "./Routes/MeetingDetails";
import Dashboard from "./Routes/Dashboard";
import CheckStudentId from "./Routes/CheckStudentId";
import DashboardTutor from "./Routes/DashboardTutor";
import WhiteBoards from "./Routes/WhiteBoards";

function App() {
  return (
    <Routes>
      <Route path="/" element = { <Login /> } />
      <Route path="/dashboard" element = { <Dashboard /> } />
      <Route path="/upcomingMeetings" element = {<UpcomingMeetings />} />
      <Route path="/previousMeetings" element = {<PreviousMeetings />} />
      <Route path="/meetingDetails" element = {<MeetingDeatils />} />
      <Route path="/checkLoginId" element = {<CheckStudentId />} />
      <Route path="/dashboardTutor" element = {<DashboardTutor />} />
      <Route path="/whiteboards" element = {<WhiteBoards />} />
    </Routes>
  );
}

export default App;
