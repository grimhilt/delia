import React, { useState, useEffect, useRef } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { Navigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';
import UsersList from '../../views/UsersList';
import SidePanel from '../SidePanel';
import GridAnecdotes from './GridAnecdotes';
import AnecdoteResults from './AnecdoteResults';
import AnecdoteEditer from '../../views/anecdote/AnecdoteEditer';


export default function Anecdote() {

    const room = useParams().id;

    const [user, _setUser] = useUser()
    const [allowed, setAllowed] = useState(0);
    const [iteration, setIteration] = useState(-1);
    const [users, setUsers] = useState([]);
    const [forbidden, setForbidden] = useState(null);
    const [nextCycle, setNextCycle] = useState(0);
    const editerRef = useRef();

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
                    console.log(last.getTime() - new Date().getTime() - 60 * 1000)
                    setNextCycle(last.getTime() - new Date().getTime() - 60 * 1000);

                    setAllowed(true);
                    // load anecdotes
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
                            editerRef?.current.setDefaultValues(res.data);
                        }
                    }).catch((err) =>{
                        // todo
                    });
                }
            }).catch((err) =>{
                setForbidden(true);
            });
        }
        
    }, [user, room, allowed]);

    const saveAnecdote = (title, anecdote) => {
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
           // todo: saved
        }).catch((err) =>{
            // todo: err
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
        console.log(milli)
        let tmp;
        let result = "";

        tmp = milli / (1000 * 60 * 60 * 24);
        if (tmp > 0) result += tmp.toFixed() + "d ";
        milli %= (1000 * 60 * 60 * 24);

        tmp = milli / (1000 * 60 * 60);
        milli %= (1000 * 60 * 60);
        if (tmp > 0) result += tmp.toFixed() + "h ";

        tmp = milli / (1000 * 60);
        milli %= (1000 * 60);
        if (tmp > 0) result += tmp.toFixed() + "m";
        
        return result;
    }

        // todo prevent multi request sending
    return (
        <>
        {forbidden ?
            <Navigate to={"/"} replace={true} /> 
            :
            <>
                <label>Next cycle in {printTime(nextCycle)}</label>
                <Tabs
                defaultActiveKey="write"
                transition={false}
                className="mb-3"
                >
                    <Tab eventKey="write" title="Write">
                        <AnecdoteEditer ref={editerRef} saveAnecdote={saveAnecdote}/>
                    </Tab>
                    <Tab eventKey="answer" title="Answer">
                        <GridAnecdotes users={users} room={room} iteration={iteration} user={user}/>
                    </Tab>
                    <Tab eventKey="result" title="Results">
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
