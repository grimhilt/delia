import React, { Component } from "react";
import { Form, Card } from "react-bootstrap";

export default class AnecdoteViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer: props?.answer ?? 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.handleChange(e);
    this.setState({ ...this.state, answer: e.target.value });
  }

  render() {
    console.log(this.state.answer)

    const usersOptions = this.props.users.map((user) => (
      <option
        key={user.id}
        value={user.id}
      >
        {user.username}
      </option>
    ));
    console.log(usersOptions)

    return (
      <Card className="text-center">
        <Card.Header>{this.props.anecdote.header}</Card.Header>
        <Card.Body>
          <Card.Title>{this.props.anecdote.title}</Card.Title>
          <Card.Text>{this.props.anecdote.body}</Card.Text>
        </Card.Body>

        <Card.Footer>
          <Form.Select defaultValue={this.state.answer} onChange={this.handleChange}>{usersOptions}</Form.Select>
        </Card.Footer>
      </Card>
    );
  }
}
