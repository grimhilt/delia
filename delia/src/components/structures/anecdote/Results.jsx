

import React, { useEffect, useState } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { useAnecdote } from "../../../contexts/AnecdoteContext";
import { useUser } from "../../../contexts/UserContext";

export default function Results(props) {
    const [user, setUser] = useUser();
    const [room, setRoom] = useAnecdote();

    const [ancdts, setAncdts] = useState([]);
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);

    const usernameById = (id) => users.find(user => user.id === id)?.username ?? "invalid";

    useEffect(() => {
        if (room && user?.token && (room.iteration-2) >= 0) {
            axios({
                method: 'post',
                url: '/api/ancdt/results',
                data: {
                token: user.token,
                room: room.id,
                iteration: room.iteration-2,
                }
            }).then(res => {
                if(res.status === 200) {
                    setAncdts(res.data.ancdts);
                    
                    // divid the array in sub array per user
                    const resultsReq = res.data.results
                    let resultsS = [];
                    let tmpResults;
                    for (let i = 0; i < resultsReq.length; i++) {
                        tmpResults = [];
                        tmpResults.push(resultsReq[i]);
                        i++;
                        while (i === 0 || (i < resultsReq.length && resultsReq[i-1].user === resultsReq[i].user)) {
                            tmpResults.push(resultsReq[i]);
                            i++;
                        }
                        i--;
                        resultsS.push(tmpResults);
                    }
                    setResults(resultsS);

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
            }).catch(() =>{
                // todo
            });
        }
    }, [room, user]);

    const correct = {};
    correct['color'] = 'green';
    const incorrect = {};
    incorrect['color'] = 'red';
    // todo not full completed
    return (
        <div>
            <Table striped bordered variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        {ancdts.map((ancdt, i) => <th key={i}>{ancdt.title} ({usernameById(ancdt.user)})</th>)}
                    </tr>
                </thead>
                <tbody>
                    {results.map((userResult, i) => {
                        return (
                            <tr key={i}>
                                <td key={i}>{usernameById(userResult[0].user)}</td>
                                {userResult.map((answer, j) => {
                                    return (
                                        <td key={j} style={answer.guessed_user === ancdts[j].user ? correct : incorrect}>
                                            {usernameById(answer.guessed_user)}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}
