import React, { Component } from "react";
import { Form, Card } from 'react-bootstrap';

export default class Anecdote extends Component {

    render() {
        const usersOptions = this.props.users.map(user => <option key={user.id} value={user.id}>{user.username}</option>);

        return (
            <Card className="text-center">
                <Card.Header>{this.props.header}</Card.Header>
                <Card.Body>
                    <Card.Title>{this.props.title}</Card.Title>
                    <Card.Text>{this.props.text}</Card.Text>
                </Card.Body>
                    
                <Card.Footer>
                    <Form.Select aria-label="Default select example" onChange={this.props.handleChange}>
                        {usersOptions}
                    </Form.Select>
                </Card.Footer>
            </Card>
        )
    }
}
