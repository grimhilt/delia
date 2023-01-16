import React, { Component, createRef } from "react";
import { Form, Button, Card } from 'react-bootstrap';

export default class AnecdoteEditer extends Component {

    constructor() {
        super();
        this.title = createRef();
        this.anecdote = createRef();
    }

    render() {

        const handleClick = () => {
            this.props.saveAnecdote(this.title?.current?.value, this.anecdote?.current?.value)
        }

        return (
            <Card className="text-center">
                <Card.Header>Your anecdote</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <Form.Control ref={this.title} type="text" placeholder="Enter a title"/>
                    </Card.Title>
                    <Form.Control ref={this.anecdote} style={{ height: "100px"}} as="textarea" placeholder="Write anything" />
                </Card.Body>
                    
                <Card.Footer className="d-grid gap-3">
                    <Button variant="primary" onClick={handleClick}>
                        Send
                    </Button>
                </Card.Footer>
            </Card>
        )
    }
}
