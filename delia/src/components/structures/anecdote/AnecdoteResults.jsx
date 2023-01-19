

import React, { useEffect, useState } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';

export default function GridAnecdotes(props) {
    // todo opti load anecdotes when open not parent
    const [ancdts, setAncdts] = useState([]);
    const [hasInfo, setHasInfo] = useState(false);
    const [results, setResults] = useState([]);

    const usernameById = (id) => props.users.find(user => user.id === id).username ?? "unvalid";

    useEffect(() => {
        if (props.room && (props.iteration-2) >= 0 && !hasInfo) {
            setHasInfo(true);
            axios({
                method: 'post',
                url: '/api/ancdt/results',
                data: {
                token: props.user.token,
                room: props.room,
                iteration: props.iteration-2,
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
                }
            }).catch(() =>{
                // todo
            });
        }
    }, [props.room, props.iteration, hasInfo]);



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
