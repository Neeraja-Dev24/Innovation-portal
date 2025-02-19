import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext/UserProvider";
import ProtectedRoute from "./Components/Auth/ProtectedRoute"; 
import NotFound from "./Components/Pages/NotFound/NotFound";

// Lazy-loaded components
const ReviewerDashboard = lazy(() =>import("./Components/ReviewerDashboard/ReviewerDashboard"));
const EmployeeDashboard = lazy(() =>import("./Components/EmployeeDashboard/EmployeeDashboard"));
const Home = lazy(() => import("./Components/Home/Home"));
const DetailPage = lazy(() => import("./Components/Pages/DetailPage"));
const Signup = lazy(() => import("./Components/Auth/SignUp/SignUp"));
const ForgotPassword = lazy(() =>import("./Components/Auth/ForgotPassword/ForgotPassword"));
const ApprovedIdeas = lazy(() =>import("./Components/EmployeeDashboard/ApprovedIdeas/ApprovedIdeas"));
const ExistingIdeas = lazy(() =>import("./Components/EmployeeDashboard/ExistingIdeas/ExistingIdeas"));
const SubmitIdeas = lazy(() =>import("./Components/EmployeeDashboard/SubmitIdeas/SubmitIdeas"));
const PendingReviews = lazy(() =>import("./Components/ReviewerDashboard/PendingReviews/PendingReviews"));
const ReviewDetailPage = lazy(() =>import("./Components/Pages/ReviewDetailPage"));

function App() {
  return (
    <UserProvider>
      <Suspense fallback={<div className="loading-screen">Loading...</div>}>
        <main aria-live="polite">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Employee Dashboard */}
              <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
                <Route path="approvedIdeas" element={<ApprovedIdeas />} />
                <Route path="myIdeas" element={<ExistingIdeas />} />
                <Route path="submitIdea/:ideaId?" element={<SubmitIdeas />} />
                <Route path="details/:ideaId" element={<DetailPage />} />
              </Route>
              {/* Reviewer Dashboard */}
              <Route path="/reviewer-dashboard" element={<ReviewerDashboard />}>
                <Route path="pendingReviews" element={<PendingReviews />} />
                <Route path="pendingdetails/:ideaId" element={<ReviewDetailPage />}/>
                <Route path="approvedIdeas" element={<ApprovedIdeas />} />
                <Route path="details/:ideaId" element={<DetailPage />} />
              </Route>
            </Route>
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Suspense>
    </UserProvider>
  );
}

export default App;
