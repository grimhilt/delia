import React, { useState, useEffect, useRef } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { Navigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';
import UsersList from '../../views/UsersList';
import GridAnecdotes from './GridAnecdotes';
import AnecdoteResults from './AnecdoteResults';
import AnecdoteEditer from '../../views/anecdote/AnecdoteEditer';

export default function Anecdote() {

    const room = useParams().id;

    const [user, setUser] = useUser()
    const [allowed, setAllowed] = useState(0);
    const [iteration, setIteration] = useState(-1);
    const [users, setUsers] = useState([]);
    const [forbidden, setForbidden] = useState(null);
    const [nextCycle, setNextCycle] = useState(0);
    const [ancdt, setAncdt] = useState({});

    useEffect(() => {
        if (user?.token && room && !allowed) {
            axios({
                method: 'get',
                url: '/api/ancdt/roomInfos',
                params: {
                  token: user.token,
                  room: room,
                }
            }).then(res => {
                if(res.status === 200) {
                    setUsers(res.data.users);
                    setIteration(res.data.room.iteration);
                    const last = new Date(res.data.room.last);
                    last.setSeconds(last.getSeconds() + res.data.room.frequency);
                    const tmpDate = new Date();
                    setNextCycle(last.getTime() - tmpDate.getTime() + tmpDate.getTimezoneOffset());

                    setAllowed(true);
                    console.log(allowed, room, user?.token)
                    // load anecdote
                    axios({
                        method: 'get',
                        url: '/api/ancdt/ancdt',
                        params: {
                          token: user.token,
                          room: room,
                          iteration: res.data.room.iteration,
                        }
                    }).then(res => {
                        if(res.status === 200 && res.data !== "") {
                            setAncdt(res.data);
                        }
                    }).catch((err) =>{
                        // todo
                        console.log(err)
                    });
                }
            }).catch((err) =>{
                setForbidden(true);
            });
        }
        
    }, [user, room, allowed]);

    const saveAnecdote = (title, anecdote) => {
        return new Promise(function(resolve, reject) {
            axios({
                method: 'post',
                url: '/api/ancdt/save',
                data: {
                    title: title,
                    body: anecdote,
                    token: user.token,
                    room: room,
                    iteration: iteration,
                }
            }).then(res => {
                if(res.status === 200) {
                    resolve();
                }
            }).catch((err) =>{
                reject(err);
            });
        });
    }

    useEffect(() => {
        if (nextCycle === 0) return;
        let interval = null;
          interval = setInterval(() => {
            setNextCycle(nextCycle - 60 * 1000);
          }, 1000 * 60);

        return () => clearInterval(interval);
    }, [nextCycle]);



    const printTime = (milli) => {
        let tmp;
        let result = "";

        tmp = Math.floor(milli / (1000 * 60 * 60 * 24));
        if (Math.floor(tmp) > 0) result += tmp + "d ";
        milli %= (1000 * 60 * 60 * 24);

        tmp = Math.floor(milli / (1000 * 60 * 60));
        milli %= (1000 * 60 * 60);
        if (tmp > 0) result += tmp + "h ";

        tmp = Math.floor(milli / (1000 * 60));
        milli %= (1000 * 60);
        if (tmp > 0) result += tmp + "m";
        
        return result;
    }

    const nextCycleStyle = {};
    nextCycleStyle.width = '-moz-available';
    nextCycleStyle['border'] = '#77779b 1px solid';
    nextCycleStyle['textAlign'] = 'center';
    nextCycleStyle['padding'] = '5px';
    nextCycleStyle['margin'] = '7px';

    // todo prevent multi request sending
    return (
        <>
        {forbidden ?
            <Navigate to={"/"} replace={true} /> 
            :
            <>
                <label style={nextCycleStyle}>Next cycle in {printTime(nextCycle)}</label>
                <Tabs
                defaultActiveKey="editer"
                transition={false}
                style={{padding: "7px", margin: "15px"}}
                >
                    <Tab eventKey="editer" title="Editer">
                        <AnecdoteEditer saveAnecdote={saveAnecdote} title={ancdt?.title} body={ancdt?.body} />
                    </Tab>
                    <Tab eventKey="answers" title="Answers">
                        <GridAnecdotes users={users} room={room} iteration={iteration} user={user}/>
                    </Tab>
                    <Tab eventKey="results" title="Results">
                        <AnecdoteResults users={users} room={room} iteration={iteration} user={user}/>
                    </Tab>
                    <Tab eventKey="infos" title="Room Infos">
                        <UsersList users={users}/>
                    </Tab>
                </Tabs>

            </>
        }
        </>
    );
}
