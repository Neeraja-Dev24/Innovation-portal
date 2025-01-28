import { createContext, useState, useContext } from 'react';

// Create the UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component to provide context to the rest of the app
export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null); // State for user

  // Login function that updates the user context
  const setUser = (user) => {
    setLoggedInUser(user); // Set the logged-in user
  };

  // Logout function that resets the user state
  const logOut = () => {
    setLoggedInUser(null); // Reset to null when logging out
  };

  return (
    <UserContext.Provider value={{ loggedInUser, setUser, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
