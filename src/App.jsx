

import './App.css'
import LoginPage from './Pages/LoginPage'
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext/UserContext';
import EmployeeDashboard from "./EmployeeDashboard/EmployeeDashboard";
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
