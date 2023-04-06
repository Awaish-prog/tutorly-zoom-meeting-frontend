import { Route, Routes} from "react-router-dom";
import Login from "./Routes/Login";
import UpcomingMeetings from "./Routes/UpcomingMeetings";
import PreviousMeetings from "./Routes/PreviousMeetings";

function App() {
  return (
    <Routes>
      <Route path="/" element = { <Login /> } />
      <Route path="/upcomingMeetings" element = {<UpcomingMeetings />} />
      <Route path="/previousMeetings" element = {<PreviousMeetings />} />
    </Routes>
  );
}

export default App;
