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
    const [allowed, setAllowed] = useState(-1);
    const [iteration, setIteration] = useState(-1);
    const [users, setUsers] = useState([]);
    const [anecdotes, setAnecdotes] = useState([]);

    const myRef = useRef();

    useEffect(() => {
        console.log("var", user?.id, room)
        // todo after login context not refreshed
        if (user?.id && room) {
            axios({
                method: 'post',
                url: '/api/ancdt/isAllowed',
                data: {
                  user: user.id,
                  room: room,
                }
            }).then(res => {
                console.log("allowed", res)
                if(res.status === 200) {
                    setIteration(res.data.iteration);
                    setAllowed(true);
                    console.log(res.data)
                    console.log(allowed, iteration)
                }
            }).catch((err) =>{
                console.log("allowed", err)
                setAllowed(false);
            });

            if (allowed) {
                axios({
                    method: 'post',
                    url: '/api/ancdt/users',
                    data: {
                      token: user.token,
                      room: room,
                    }
                }).then(res => {
                    if(res.status === 200) {
                        setUsers(res.data);
                    }
                }).catch(() =>{
                    // todo 
                });
                
            }
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

    return (

        <>
            {console.log("final:", allowed)}
            {allowed === -1 ? 
            <>Verify access</>
            : allowed ?
            <>
                
                <SidePanel parentRef={myRef} ref={myRef}>
                    <UsersList users={users}/>
                </SidePanel>

                <Tabs
                defaultActiveKey="write"
                transition={false}
                className="mb-3"
                style={{"marginRight": "288px"}}
                >
                    <Tab eventKey="write" title="Write">
                        <AnecdoteEditer saveAnecdote={saveAnecdote}/>
                    </Tab>
                    <Tab eventKey="answer" title="Answer">
                        <GridAnecdotes users={users} room={room} iteration={iteration} user={user}/>
                    </Tab>
                    <Tab eventKey="result" title="Results">
                        <AnecdoteResults users={users} room={room} iteration={iteration} user={user}/>
                    </Tab>
                </Tabs>

            </>

            :
            <Navigate to={"/"} replace={true}/>
            }
        </>
    );
}
