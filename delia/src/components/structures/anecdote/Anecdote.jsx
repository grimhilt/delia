import React, { useState, useEffect, useRef } from 'react'
import { Tabs, Tab, TabContainer} from 'react-bootstrap'
import { Navigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';
import UsersList from '../../views/UsersList';
import SidePanel from '../SidePanel';
import GridAnecdotes from './GridAnecdotes';
import AnecdoteResults from './AnecdoteResults';
import AnecdoteEditer from '../../views/anecdote/AnecdoteEditer';


export default function Anecdote(props) {

    const room = useParams().id;

    const [user, setUser] = useUser()
    const [allowed, setAllowed] = useState(0);
    const [iteration, setIteration] = useState(-1);
    const [users, setUsers] = useState([]);
    const [anecdote, setAnecdote] = useState(null);
    const [forbidden, setForbidden] = useState(null);

    const editerRef = useRef();

    useEffect(() => {
        console.log("var", user?.id, room)
        // todo after login context not refreshed
        if (user?.token && room && !allowed) {
            axios({
                method: 'get',
                url: '/api/ancdt/roomInfos',
                params: {
                  token: user.token,
                  room: room,
                }
            }).then(res => {
                console.log(res.data)
                if(res.status === 200) {
                    setUsers(res.data.users);
                    setIteration(res.data.iteration);
                    setAllowed(true);
                    console.log("load")
                    console.log(res.data.iteration)
                    // load anecdotes
                    axios({
                        method: 'get',
                        url: '/api/ancdt/ancdt',
                        params: {
                          token: user.token,
                          room: room,
                          iteration: res.data.iteration,
                        }
                    }).then(res => {
                        console.log(res.data)
                        if(res.status === 200 && res.data != "") {
                            editerRef?.current.setDefaultValues(res.data);
                        }
                    }).catch((err) =>{
                        console.log(err.response)
                        // todo 
                    });
                }
            }).catch((err) =>{
                console.log(err.response)
                setForbidden(true);
            });
        }
        
        return () => {
            // console.log('MyComponent onUnmount');
        };
    }, [user, room]);


    React.useEffect(() => {
        console.log("render")
    });

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

        // todo prevent multi request sending
    return (
        <>
        {forbidden ?
            <Navigate to={"/"} replace={true} /> 
            :
            <>
                <SidePanel>
                    <UsersList users={users}/>
                </SidePanel>
                
                <div style={{"marginRight": "288px"}}>
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
                    </Tabs>

                </div>
            </>
        }
        </>
    );
}
