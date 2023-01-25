import React, { Component } from "react";
import { ListGroup, Card } from 'react-bootstrap';

export default class UsersList extends Component {

    render() {
        const style = {};
        style.width = '18rem';
        style['backgroundColor'] = '#181a1b';
        style['margin'] = 'auto';
        const usersList = this.props.users.map(user => <ListGroup.Item style={style} key={user.id}>{user.username}</ListGroup.Item>);

        return (
            <Card style={style}>
                <Card.Header>Users: </Card.Header>
                <ListGroup variant="flush">
                    {usersList}                
                </ListGroup>
            </Card>
        )
    }
}
