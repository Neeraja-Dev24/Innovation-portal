import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  // Memoized user data from localStorage 
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser")) || null;
    } catch {
      return null;
    }
  }, []);

  const [loggedInUser, setLoggedInUser] = useState(storedUser);

  // Only update localStorage when the user actually changes
  useEffect(() => {
    loggedInUser
      ? localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
      : localStorage.removeItem("loggedInUser");
  }, [loggedInUser]);

  const setUser = useCallback((user) => {
    setLoggedInUser(user && Object.keys(user).length ? user : null);
  }, []);

  const logOut = useCallback(() => {
    navigate("/login");
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  }, [navigate]);

  return (
    <UserContext.Provider value={{ loggedInUser, setUser, logOut }}>
      <div aria-live="polite">{children}</div>
    </UserContext.Provider>
  );
};

// PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
