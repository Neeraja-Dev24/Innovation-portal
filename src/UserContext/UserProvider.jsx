import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const setUser = (user) => {
    setLoggedInUser(user);
  };

  const logOut = () => {
    setLoggedInUser(null);
  };

  return (
    <UserContext.Provider value={{ loggedInUser, setUser, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

// Add PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
