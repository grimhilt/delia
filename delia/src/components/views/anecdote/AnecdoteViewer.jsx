import React, { useState } from "react";
import { Form, Card } from "react-bootstrap";

export default function AnecdoteViewer(props) {
    const [answer, setAnswer] = useState(props?.answer ?? 0);
    console.log(answer)
    const [save, setSave] = useState("");

    function handleChange(e) {
        props
            .handleChange(e)
            .then(() => {
                setSave(
                    ` (Saved at ${new Date().toLocaleTimeString("fr-fr")})`
                );
            })
            .catch(() => {
                setSave(" (Save failed)");
            });
        setAnswer(e.target.value);
    }

    const usersOptions = props.users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.username}
        </option>
    ));

    return (
        <Card className="text-center">
            <Card.Header>
                {props.anecdote.header}
                {save}
            </Card.Header>
            <Card.Body>
                <Card.Title>{props.anecdote.title}</Card.Title>
                <Card.Text>{props.anecdote.body}</Card.Text>
            </Card.Body>

            <Card.Footer>
                <Form.Select value={answer} onChange={handleChange}>
                    <option disabled value={-1}>
                        Default
                    </option>
                    {usersOptions}
                </Form.Select>
            </Card.Footer>
        </Card>
    );
}
