import './App.css'
import LoginPage from './Components/Pages/LoginPage';
import EmployeeDashboard from './Components/EmployeeDashboard/EmployeeDashboard';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext/UserContext';
// import ReviewerDashboard from "./ReviewerDashboard/ReviewerDashboard";
function App() {
  return (
    <UserProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          {/* <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} /> */}
        </Routes>
    </UserProvider>
   
  )
}

export default App
