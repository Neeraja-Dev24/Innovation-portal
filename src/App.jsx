import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext/UserProvider";
import ReviewerDashboard from "./Components/ReviewerDashboard/ReviewerDashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard/EmployeeDashboard";
import Home from "./Components/Home/Home";
import DetailPage from "./Components/Pages/DetailPage";
import Signup from "./Components/Auth/SignUp/SignUp";
import ForgotPassword from "./Components/Auth/ForgotPassword/ForgotPassword";
import ApprovedIdeas from "./Components/EmployeeDashboard/ApprovedIdeas/ApprovedIdeas";
import ExistingIdeas from "./Components/EmployeeDashboard/ExistingIdeas/ExistingIdeas";
import SubmitIdeas from "./Components/EmployeeDashboard/SubmitIdeas/SubmitIdeas";
import PendingReviews from "./Components/ReviewerDashboard/PendingReviews/PendingReviews";
import ReviewDetailPage from "./Components/Pages/ReviewDetailPage";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
          {/* Nested routes */}
          <Route path="approvedIdeas" element={<ApprovedIdeas />} />
          <Route path="myIdeas" element={<ExistingIdeas />} />
          <Route path="submitIdea/:ideaId?" element={<SubmitIdeas />} />
          <Route path="details/:ideaId" element={<DetailPage />} />
        </Route>

        {/* Reviewer Dashboard Route */}
        <Route path="/reviewer-dashboard" element={<ReviewerDashboard />}>
          {/* Nested routes */}
          <Route path="pendingReviews" element={<PendingReviews />} />
          <Route path="pendingdetails/:ideaId" element={<ReviewDetailPage />} />
          <Route path="approvedIdeas" element={<ApprovedIdeas />} />
          <Route path="details/:ideaId" element={<DetailPage />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
