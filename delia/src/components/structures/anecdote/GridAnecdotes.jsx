

import React, { Component } from "react";
import AnecdoteViewer from "../../views/anecdote/AnecdoteViewer";
import axios from 'axios';

export default class GridAnecdotes extends Component {
    // todo opit load anecdotes when open not parent
    
    constructor(user, users, room, iteration) {
        super();
        this.state = {anecdotes:[], answers:[], anecdoteSet: false};

    }

    handleChange(id) {
        return (e) => {
            axios({
                method: 'post',
                url: '/api/ancdt/answer',
                data: {
                    token: this.props.user.token,
                    room: this.props.room,
                    iteration: (this.props.iteration-1),
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

    getAnswer(ancdtId) {
        return this.state.answers?.find(answer => answer.anecdote === ancdtId)?.guessed_user ?? -1;
    }

    render() {

        if (this.props.room && this.props.iteration !== "-1" && !this.state.anecdoteSet) {
            axios({
                method: 'get',
                url: '/api/ancdt/answersInfo',
                params: {
                    token: this.props.user.token,
                    room: this.props.room,
                    iteration: this.props.iteration-1,
                }
            }).then(res => {
                if(res.status === 200) {
                    this.setState({anecdotes:res.data.ancdts, answers:res.data.answers, anecdoteSet: true});
                }
            }).catch((err) =>{
                this.setState({anecdoteSet: true});
            });
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
            return (
                <AnecdoteViewer
                  key={i}
                  users={this.props.users}
                  anecdote={anecdote}
                  handleChange={this.handleChange(anecdote.id)}
                  answer={this.getAnswer(anecdote.id)}
                />
              );
        });
        
        return (
            <div style={gridAnecdotesStyle}>
                {anecdotesList}
            </div>
        )
    }
}
