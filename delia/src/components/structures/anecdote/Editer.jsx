import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap';
import { useAnecdote } from '../../../contexts/AnecdoteContext';
import { useUser } from '../../../contexts/UserContext';
import axios from "axios";

export default function Editer(props) {

    const [user, setUser] = useUser();
    const [room, setRoom] = useAnecdote();

    const titleRef = useRef();
    const bodyRef = useRef();
    const [ancdt, setAncdt] = useState({title: "", body: ""});
    const [button, setButton] = useState(true);
    const [buttonText, setButtonText] = useState("Up to date !");

    useEffect(() => {
        if (room && user?.token) {
            axios({
                method: 'get',
                url: '/api/ancdt/ancdt',
                params: {
                    token: user.token,
                    room: room.id,
                    iteration: room.iteration,
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
     
    }, [room, user]);
    
    function handleChange(e) {
        if (e.target.name === "title") {
            setAncdt(() => ({title: e.target.value}));
        } else if (e.target.name === "body") {
            setAncdt(() => ({body: e.target.value}));
        }
        setButton(false);
        setButtonText("Save");
    }

    function handleClick(e) {
        setButton(true);
        e.target.innerText = "Sending...";
        axios({
            method: "post",
            url: "/api/ancdt/save",
            data: {
                title: titleRef?.current?.value,
                body: bodyRef?.current?.value,
                token: user.token,
                room: room.id,
                iteration: room.iteration,
            },
        }).then((res) => {
            if (res.status === 200) {
                e.target.innerText = "Up to date !";
            }
        }).catch((err) => {
            if (err.response.status === 403) {
                e.target.innerText = "You are after the deadline...";
            } else {
                setButton(false);
                e.target.innerText = "Error, contact an administrator or try again";
            }
        });
    }

    return (
        <Card className="text-center" style={{margin: "10px"}}>
            <Card.Header>Your anecdote</Card.Header>
            <Card.Body>
                <Card.Title>
                    <Form.Control 
                        ref={titleRef}
                        type="text"
                        placeholder="Enter a title"
                        name="title"
                        value={ancdt.title}
                        onChange={handleChange}
                    />
                </Card.Title>
                <Form.Control
                    ref={bodyRef}
                    style={{ height: "100px"}}
                    as="textarea"
                    placeholder="Write anything"
                    name="body"
                    value={ancdt.body}
                    onChange={handleChange}
                />
            </Card.Body>
                
            <Card.Footer className="d-grid gap-3">
                <Button disabled={button} variant="primary" onClick={handleClick}>
                    {buttonText}
                </Button>
            </Card.Footer>
        </Card>
    );
}
