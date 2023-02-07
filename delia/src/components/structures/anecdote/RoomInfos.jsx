

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAnecdote } from "../../../contexts/AnecdoteContext";
import { useUser } from "../../../contexts/UserContext";
import UsersList from '../../views/UsersList';

export default function Results(props) {
    const [user, setUser] = useUser();
    const [room, setRoom] = useAnecdote();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (room && user?.token && (room.iteration-2) >= 0) {
            axios({
                method: 'get',
                url: '/api/ancdt/users',
                params: {
                    token: user.token,
                    room: room.id,
                }
            }).then(res => {
                if(res.status === 200) {
                    setUsers(res.data)
                }
            }).catch((err) =>{
                //todo uniquely crash server
            });
        }
    }, [room, user]);

    return (
        <UsersList users={users}/>
    )
}
