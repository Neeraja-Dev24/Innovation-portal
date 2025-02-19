import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext/useUser";

const ProtectedRoute = () => {
  const { loggedInUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser && !localStorage.getItem("loggedInUser")) {
      navigate("/login", { replace: true });
    }
  }, [loggedInUser, navigate]);

  return loggedInUser || localStorage.getItem("loggedInUser") ? <Outlet /> : null;
};

export default ProtectedRoute;

