

import React, { useEffect, useState } from "react";
import AnecdoteViewer from "../../views/anecdote/AnecdoteViewer";
import axios from 'axios';
import { useUser } from "../../../contexts/UserContext";
import { useAnecdote } from "../../../contexts/AnecdoteContext";

export default function Answers(props) {
    const [user, setUser] = useUser();
    const [room, setRoom] = useAnecdote();

    const [anecdotes, setAnecdotes] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [users, setUsers] = useState([]);

    function handleChange(id) {
        return (e) => {
            console.log(e.target.value)
            return new Promise(function(resolve, reject) {
                axios({
                    method: 'post',
                    url: '/api/ancdt/answer',
                    data: {
                        token: user.token,
                        room: room.id,
                        iteration: (room.iteration-1),
                        ancdt: id,
                        guessed_user: e.target.value,
                    }
                }).then(res => {
                    if (res.status === 200) {
                        resolve();
                    }
                }).catch((err) =>{
                    reject()
                });
            });
        }
    }

    function getAnswer(ancdtId) {
        return answers?.find(answer => answer.anecdote === ancdtId)?.guessed_user ?? -1;
    }

    useEffect(() => {
        if (room && room.iteration >= 1 && user?.token) {
            axios({
                method: 'get',
                url: '/api/ancdt/answersInfo',
                params: {
                    token: user.token,
                    room: room.id,
                    iteration: room.iteration-1,
                }
            }).then(res => {
                if(res.status === 200) {
                    console.log(res.data)
                    setAnecdotes(res.data.ancdts);
                    setAnswers(res.data.answers);

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
            }).catch((err) =>{
                //todo 
            });
        }
    }, [room, user]);


    const gridAnecdotesStyle = {};
    // gridAnecdotesStyle.width = '100%';
    gridAnecdotesStyle['display'] = 'grid';
    gridAnecdotesStyle['justifyContent'] = 'center';
    gridAnecdotesStyle['alignContent'] = 'center';
    gridAnecdotesStyle['gap'] = '4px';
    gridAnecdotesStyle['gridTemplateColumns'] = 'repeat(auto-fill, minmax(600px , 1fr))';

    const anecdotesList = anecdotes?.map((anecdote, i) => {
        anecdote.header = "Anecdote #"+i;
        return (
            <AnecdoteViewer
                key={i}
                users={users}
                anecdote={anecdote}
                handleChange={handleChange(anecdote.id)}
                answer={getAnswer(anecdote.id)}
            />
            );
    });
    
    return (
        <div style={gridAnecdotesStyle}>
            {anecdotesList}
        </div>
    )
}
