import React, { Component, createRef } from "react";
import { Form, Button, Card } from 'react-bootstrap';

export default class AnecdoteEditer extends Component {

    constructor(props) {
        super(props);
        this.title = createRef();
        this.anecdote = createRef();
        this.state = {button: true, buttonText: "Up to date !"}
        
        this.state = {
            title: props?.anecdote?.title ?? "",
            body: props?.anecdote?.body ?? "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value, button: false, buttonText: "Send" });
    }

    handleClick(e) {
        this.setState({ ...this.state, button: true });
        e.target.innerText = "Sending...";
        this.props.saveAnecdote(this.title?.current?.value, this.anecdote?.current?.value).then(() => {
            e.target.innerText = "Up to date !";
        }).catch(err => {
            if (err.response.status == 403) {
                e.target.innerText = "You are after the deadline...";
            } else {
                this.setState({ ...this.state, button: false });
                e.target.innerText = "Error, contact an administrator or try again";
            }
        })
    }

    setDefaultValues(ancdt) {
        this.setState({...this.state, title: ancdt.title, body: ancdt.body, button: true, buttonText: "Up to date !"})
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
                    <Button ref={this.button} disabled={this.state.button} variant="primary" onClick={this.handleClick}>
                        {this.state.buttonText}
                    </Button>
                </Card.Footer>
            </Card>
        )
    }
}
