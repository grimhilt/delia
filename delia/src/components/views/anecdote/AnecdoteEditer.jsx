import React, { Component, createRef } from "react";
import { Form, Button, Card } from 'react-bootstrap';

export default class AnecdoteEditer extends Component {

    constructor(props) {
        super(props);
        this.title = createRef();
        this.anecdote = createRef();

        this.state = {
            title: props?.anecdote?.title ?? "",
            body: props?.anecdote?.body ?? "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    handleClick() {
        this.props.saveAnecdote(this.title?.current?.value, this.anecdote?.current?.value)
    }

    setDefaultValues(ancdt) {
        this.setState({...this.state, title: ancdt.title, body: ancdt.body})
    }

    render() {

        return (
            <Card className="text-center">
                <Card.Header>Your anecdote</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <Form.Control 
                            ref={this.title}
                            type="text"
                            placeholder="Enter a title"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                    </Card.Title>
                    <Form.Control
                        ref={this.anecdote}
                        style={{ height: "100px"}}
                        as="textarea"
                        placeholder="Write anything"
                        name="body"
                        value={this.state.body}
                        onChange={this.handleChange}
                    />
                </Card.Body>
                    
                <Card.Footer className="d-grid gap-3">
                    <Button variant="primary" onClick={this.handleClick}>
                        Send
                    </Button>
                </Card.Footer>
            </Card>
        )
    }
}
