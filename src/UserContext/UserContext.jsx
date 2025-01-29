import { createContext, useState, useContext } from 'react';
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

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
