

import React, { Component, Fragment } from "react";
import AnecdoteViewer from "../../views/anecdote/AnecdoteViewer";
import { useUser } from '../../../contexts/UserContext';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import parse from 'html-react-parser';

export default class GridAnecdotes extends Component {
    // todo opit load anecdotes when open not parent
    
    constructor(users, room, iteration) {
        super();
        this.state = {data:{result:[], ancdt:[]}, anecdoteSet: false, results:[]};

    }

    // componentWillReceiveProps({users, room, iteration}) {
    //     this.setState(prevStates => ({users, room, iteration, ...prevStates}));
    //     console.log("frst")
    // }
        //     
    test() {
        console.log("test")
        let results = [];
        let tmpResults;
        for (let i = 0; i < this.state.data.result.length; i++) {
            tmpResults = [];
            tmpResults.push(this.state.data.result[i]);
            i++;
            while (i === 0 || (i < this.state.data.result.length && this.state.data.result[i-1].user == this.state.data.result[i].user)) {
                tmpResults.push(this.state.data.result[i]);
                i++;
            }
            i--;
            results.push(tmpResults);
        }
        console.log(results)
        this.setState(prev => ({...prev, results:results}))
        return "ok"
    }
    
    render() {

        if (this.props.room && this.props.iteration != "-1" && !this.state.anecdoteSet) {
            axios({
                method: 'post',
                url: '/api/ancdt/results',
                data: {
                token: this.props.user.token,
                room: this.props.room,
                iteration: this.props.iteration,
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
                        while (i === 0 || (i < this.state.data.result.length && this.state.data.result[i-1].user == this.state.data.result[i].user)) {
                            tmpResults.push(this.state.data.result[i]);
                            i++;
                        }
                        i--;
                        results.push(tmpResults);
                    }
                    console.log(results)
                    this.setState(prev => ({...prev, results:results}))
                }
            }).catch(() =>{
                // todo 
                this.setState({anecdoteSet: true});
            });
        }


        const style = {};
       
        console.log(this.state.results)
        return (
            <div style={style}>
                <Table striped bordered variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            {this.state.data.ancdt.map((ancdt, i) => <th key={i}>{ancdt.title}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.results.map((userResult, i) => {
                            return (<tr key={i}>
                                <td key={i}>{userResult[0].user}</td>
                                {userResult.map((answer, j) => {
                                    return <td key={j}>{answer.guessed_user}</td>
                                })}
                            </tr>)
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}
