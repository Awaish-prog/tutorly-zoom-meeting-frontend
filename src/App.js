import { Route, Routes} from "react-router-dom";
import Login from "./Routes/Login";
import UpcomingMeetings from "./Routes/UpcomingMeetings";
import PreviousMeetings from "./Routes/PreviousMeetings";
import MeetingDeatils from "./Routes/MeetingDetails";
import Dashboard from "./Routes/Dashboard";
import CheckStudentId from "./Routes/CheckStudentId";

function App() {
  return (
    <Routes>
      <Route path="/" element = { <Login /> } />
      <Route path="/dashboard" element = { <Dashboard /> } />
      <Route path="/upcomingMeetings" element = {<UpcomingMeetings />} />
      <Route path="/previousMeetings" element = {<PreviousMeetings />} />
      <Route path="/meetingDetails" element = {<MeetingDeatils />} />
      <Route path="/checkLoginId" element = {<CheckStudentId />} />
    </Routes>
  );
}

export default App;
