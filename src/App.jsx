import './App.css'
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext/UserContext';
import ReviewerDashboard from './Components/ReviewerDashboard/ReviewerDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard/EmployeeDashboard';
import IdeaDetails from './Components/ReviewerDashboard/IdeaDetails/IdeaDetails';
import Home from './Components/Home/Home';
import DetailPage from './Components/Pages/DetailPage';
function App() {
  return (
    <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee-dashboard/:menu" element={<EmployeeDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
          <Route path="/idea-details/:key" element={<IdeaDetails />} /> 
          <Route path="/details/:key" element={<DetailPage />} /> 
        </Routes>
    </UserProvider>
   
  )
}

export default App
