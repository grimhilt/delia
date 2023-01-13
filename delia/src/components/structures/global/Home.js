import Form from 'react-bootstrap/Form';
import { ListGroup, Card, Toast, Row, Col, Button } from 'react-bootstrap';
import React, { useState } from 'react'

export default function Home() {

  const [showB, setShowB] = useState(true);

  const toggleShowB = () => setShowB(!showB);

  return (

    <>

        <Button onClick={toggleShowB} className="mb-2">
          Toggle Toast <strong>without</strong> Animation
        </Button>
        <Toast onClose={toggleShowB} show={showB} animation={false}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
        </Toast>
    
    {/* list users */}
    <Card style={{ width: '18rem' }} onClose={toggleShowB} show={showB} animation={false}>
      <ListGroup variant="flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </Card>

    <Card className="text-center">
      <Card.Header>Anecdote #1</Card.Header>
      <Card.Body>
        <Card.Title>Special title treatment</Card.Title>
        <Card.Text>
          Cillum magna deserunt nulla occaecat ad dolore fugiat consectetur reprehenderit eu irure anim commodo. Magna deserunt cillum in cillum pariatur duis id Lorem tempor Lorem. Laborum tempor cillum occaecat et eiusmod anim ullamco in nostrud do enim ad enim in.
        </Card.Text>
      </Card.Body>
        
      <Card.Footer>
        <Form.Select aria-label="Default select example">
          <option>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
        </Card.Footer>
    </Card>

    
    <Form.Control
      as="textarea"
      placeholder="Leave a comment here"
      style={{ height: '100px' }}
    />

    
    </>
  );
}
