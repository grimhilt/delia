
import React, { createContext, useContext, useState } from 'react';
import { getToken } from "../utils/useToken";
import axios from 'axios';

export const UserContext = createContext({});

export const UserProvider = props => {

  const [user, setUser] = useState({ id: null, username: null, token: null });
  const token = getToken();

  if (!user?.username && token) {
    setUser(prevUser => ({
      prevUser,
      token: token
    }));
    axios({
      method: 'post',
      url: '/api/profile',
      data: {
        token: token,
      }
    }).then(res =>{
      if(res.status === 200 && res.statusText === "OK"){
        setUser(prevUser => ({
          id: res.data.id,
          username: res.data.username
        }));
      }
    }).catch((err) => { console.log(err.response?.status)});       
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

