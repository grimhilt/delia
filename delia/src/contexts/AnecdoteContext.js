import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useParams, Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

export const RoomContext = createContext({});

export const AnecdoteProvider = (props) => {
    const [room, setRoom] = useState();
    const [user, setUser] = useUser()
    const [forbidden, setForbidden] = useState(false);
    const roomId = useParams().id;

    if (room === undefined && user?.token) {
        axios({
            method: 'get',
            url: '/api/ancdt/roomInfos',
            params: {
              token: user.token,
              room: roomId,
            }
        }).then(res => {
            if(res.status === 200) {
                setRoom(res.data);
            }
        }).catch(() => {
            setForbidden(true);
        });
    }

    return (
        <>
            {forbidden ?
                <Navigate to={"/"} replace={true} /> 
            :
            <RoomContext.Provider value={[room, setRoom]}>
                {props.children}
            </RoomContext.Provider>
            }
        </>
    );
};

export function useAnecdote() {
    return useContext(RoomContext);
}
