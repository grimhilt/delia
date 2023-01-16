
import React, { createContext, useContext, useState } from 'react';
import { clearToken, getToken } from "../utils/useToken";
import axios from 'axios';

export const UserContext = createContext({});

export const UserProvider = props => {
  const [user, setUser] = useState({ token: getToken() });
  console.log("userprovider", user.token, user.id)

  if (!user?.username && user.token) {
    axios({
      method: 'post',
      url: '/api/profile',
      data: {
        token: user.token,
      }
    }).then(res =>{
      if (res.status === 200 && res.statusText === "OK") {
        setUser(prevUser => ({
          ...prevUser,
          id: res.data.id,
          username: res.data.username,
        }));
      }
    }).catch((err) => {
      clearToken();
    });       
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};

export function useUser(){
  return useContext(UserContext);
}

