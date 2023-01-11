
import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext({});

export const UserProvider = props => {
  const [user, setUser] = useState({ id: null, username: null });

  return(
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};

export function useUser(){
  return useContext(UserContext);
}

