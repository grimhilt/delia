import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap';

export default function AnecdoteEditer(props) {

    const titleRef = useRef();
    const bodyRef = useRef();
    const [button, setButton] = useState(true);
    const [buttonText, setButtonText] = useState("Up to date !");
    const [title, setTitle] = useState(props?.title ?? "");
    const [body, setBody] = useState(props?.body ?? "");        

    useEffect(() => {
        setTitle(props?.title ?? "");
        setBody(props?.body ?? "");
    }, [props.title, props.body]);
    
    function handleChange(e) {
        if (e.target.name === "title") {
            setTitle(e.target.value);
        } else if (e.target.name === "body") {
            setBody(e.target.value);
        }
        setButton(false);
        setButtonText("Save");
    }

    function handleClick(e) {
        setButton(true);
        e.target.innerText = "Sending...";
        props.saveAnecdote(titleRef?.current?.value, bodyRef?.current?.value).then(() => {
            e.target.innerText = "Up to date !";
        }).catch(err => {
            if (err.response.status === 403) {
                e.target.innerText = "You are after the deadline...";
            } else {
                setButton(false);
                e.target.innerText = "Error, contact an administrator or try again";
            }
        })
    }

    function setDefaultValues(ancdt) {
        setTitle(ancdt.title);
        setBody(ancdt.body);
        setButton(true);
        setButtonText("Up to date !");
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
                        value={title}
                        onChange={handleChange}
                    />
                </Card.Title>
                <Form.Control
                    ref={bodyRef}
                    style={{ height: "100px"}}
                    as="textarea"
                    placeholder="Write anything"
                    name="body"
                    value={body}
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
