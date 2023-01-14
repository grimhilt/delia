import React, { Component } from "react";
import { ListGroup, Card } from 'react-bootstrap';

export default class UsersList extends Component {

    render() {
        const usersListStyle = {};
        usersListStyle.width = '18rem';
        usersListStyle['float'] = 'right';

        const usersList = this.props.users.map(user => <ListGroup.Item key={user.id}>{user.username}</ListGroup.Item>);

        return (
            <Card style={usersListStyle}>
                <ListGroup variant="flush">
                    {usersList}                
                </ListGroup>
            </Card>
        )
    }
}
