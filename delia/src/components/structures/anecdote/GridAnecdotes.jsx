

import React, { useEffect, useState } from "react";
import AnecdoteViewer from "../../views/anecdote/AnecdoteViewer";
import axios from 'axios';

export default function GridAnecdotes(props) {
    const [anecdotesSet, setAnecdotesSet] = useState(false);
    const [anecdotes, setAnecdotes] = useState([]);
    const [answers, setAnswers] = useState([]);

    function handleChange(id) {
        return (e) => {
            axios({
                method: 'post',
                url: '/api/ancdt/answer',
                data: {
                    token: props.user.token,
                    room: props.room,
                    iteration: (props.iteration-1),
                    ancdt: id,
                    guessed_user: e.target.value,
                }
            }).then(res => {
               // todo: saved
            }).catch((err) =>{
                // todo: err
            });
        }
    }

    function getAnswer(ancdtId) {
        return answers?.find(answer => answer.anecdote === ancdtId)?.guessed_user ?? -1;
    }

    useEffect(() => {
        if (props.room && props.iteration >= 1 && !anecdotesSet) {
            axios({
                method: 'get',
                url: '/api/ancdt/answersInfo',
                params: {
                    token: props.user.token,
                    room: props.room,
                    iteration: props.iteration-1,
                }
            }).then(res => {
                if(res.status === 200) {
                    setAnecdotesSet(true);
                    setAnecdotes(res.data.ancdts);
                    setAnswers(res.data.answers);
                }
            }).catch((err) =>{
                setAnecdotesSet(true);
            });
        }
    }, [props.room, props.iteration, anecdotesSet, props.user.token]);


    const gridAnecdotesStyle = {};
    // gridAnecdotesStyle.width = '100%';
    gridAnecdotesStyle['display'] = 'grid';
    gridAnecdotesStyle['justifyContent'] = 'center';
    gridAnecdotesStyle['alignContent'] = 'center';
    gridAnecdotesStyle['gap'] = '4px';
    gridAnecdotesStyle['gridTemplateColumns'] = 'repeat(auto-fill, minmax(600px , 1fr))';

    const anecdotesList = anecdotes.map((anecdote, i) => {
        anecdote.header = "Anecdote #"+i;
        return (
            <AnecdoteViewer
                key={i}
                users={props.users}
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
