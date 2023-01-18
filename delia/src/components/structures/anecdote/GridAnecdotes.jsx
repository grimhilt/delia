

import React, { Component } from "react";
import AnecdoteViewer from "../../views/anecdote/AnecdoteViewer";
import { useUser } from '../../../contexts/UserContext';
import axios from 'axios';

export default class GridAnecdotes extends Component {
    // todo opit load anecdotes when open not parent
    
    constructor(users, room, iteration) {
        super();
        this.state = {anecdotes:[], anecdoteSet: false};

    }

    // componentWillReceiveProps({users, room, iteration}) {
    //     this.setState(prevStates => ({users, room, iteration, ...prevStates}));
    //     console.log("frst")
    // }
    onLoad() {
    }
        //     
      
    render() {

        if (this.props.room && this.props.iteration != "-1" && !this.state.anecdoteSet) {
            axios({
                method: 'get',
                url: '/api/ancdt/allAncdt',
                params: {
                    token: this.props.user.token,
                    room: this.props.room,
                    iteration: this.props.iteration-1,
                }
            }).then(res => {
                if(res.status === 200) {
                    this.setState({anecdotes:res.data, anecdoteSet: true});
                }
            }).catch(() =>{
                // todo 
                this.setState({anecdoteSet: true});
            });
        }

        const handleChange = (id) => {
            return (e) => {
              console.log(id, e.target.value)
            }
        }

        const gridAnecdotesStyle = {};
        // gridAnecdotesStyle.width = '100%';
        gridAnecdotesStyle['display'] = 'grid';
        gridAnecdotesStyle['justifyContent'] = 'center';
        gridAnecdotesStyle['alignContent'] = 'center';
        gridAnecdotesStyle['gap'] = '4px';
        gridAnecdotesStyle['gridTemplateColumns'] = 'repeat(auto-fill, minmax(600px , 1fr))';

        const anecdotesList = this.state.anecdotes.map((anecdote, i) => {
            anecdote.header = "Anecdote #"+i;
            return <AnecdoteViewer key={i} users={this.props.users} anecdote={anecdote} handleChange={handleChange(i)}  />
        });
        
        return (
            <div style={gridAnecdotesStyle}>
                {anecdotesList}
            </div>
        )
    }
}
