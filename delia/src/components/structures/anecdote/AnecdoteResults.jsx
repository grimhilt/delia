

import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';

export default class GridAnecdotes extends Component {
    // todo opit load anecdotes when open not parent
    
    constructor() {
        super();
        this.state = {data:{result:[], ancdt:[]}, anecdoteSet: false, results:[]};
    }
    
    render() {
        const usernameById = (id) => this.props.users.find(user => user.id === id).username ?? "unvalid";

        if (this.props.room && this.props.iteration !== "-1" && !this.state.anecdoteSet) {
            axios({
                method: 'post',
                url: '/api/ancdt/results',
                data: {
                token: this.props.user.token,
                room: this.props.room,
                iteration: this.props.iteration-2,
                }
            }).then(res => {
                if(res.status === 200) {
                    this.setState({data:res.data, anecdoteSet: true});


                    let results = [];
                    let tmpResults;
                    for (let i = 0; i < this.state.data.result.length; i++) {
                        tmpResults = [];
                        tmpResults.push(this.state.data.result[i]);
                        i++;
                        while (i === 0 || (i < this.state.data.result.length && this.state.data.result[i-1].user === this.state.data.result[i].user)) {
                            tmpResults.push(this.state.data.result[i]);
                            i++;
                        }
                        i--;
                        results.push(tmpResults);
                    }
                    this.setState(prev => ({...prev, results:results}))
                }
            }).catch(() =>{
                // todo 
                this.setState({anecdoteSet: true});
            });
        }


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
                            {this.state.data.ancdt.map((ancdt, i) => <th key={i}>{ancdt.title} ({usernameById(ancdt.user)})</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.results.map((userResult, i) => {
                            return (
                                <tr key={i}>
                                    <td key={i}>{usernameById(userResult[0].user)}</td>
                                    {userResult.map((answer, j) => {
                                        return (
                                            <td key={j} style={answer.guessed_user === this.state.data.ancdt[j].user ? correct : incorrect}>
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
}
