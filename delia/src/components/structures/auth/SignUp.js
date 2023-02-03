import React, { useRef, useState } from 'react'
import { Container, Form, Button, Alert, Stack } from 'react-bootstrap'
import { Navigate } from "react-router-dom";
import axios from 'axios';
import { setToken } from '../../../utils/useToken';
import { useUser } from '../../../contexts/UserContext';
import { CLink } from '../../../styled-components/CLink';

export default function SignUp(props) {
    
  const userInput = useRef();
  const pwd = useRef();
  const pwd2 = useRef();

  const alert = useRef();
  const [alerte, setAlert] = useState();

  let referer = props.location?.state?.referer ?? '/';
  const [ user, setUser] = useUser();

  if (user.token) {
    return <Navigate to={referer} />;
  }

  function handleSubmit(e) {
      e.preventDefault()

      if (!userInput.current?.value || (pwd.current?.value !== pwd2.current?.value) || !pwd.current?.value) {
        setAlert("Your password are not identical or you are missing a field");
        alert.current.hidden = false;
      } else {
        axios({
          method: 'post',
          url: '/api/signup',
          data: {
            username: userInput.current.value,
            pwd: pwd.current.value,
          }
        }).then(res => {
            if(res.status === 200 && res.statusText === "OK") {
              setToken(res.data.token);
              setUser(prevUser => ({
                id: res.data.id,
                username: userInput.current.value,
                token: res.data.token
              }));
            }
        }).catch(error => {
          if (error.response?.status === 406) {
            setAlert("Username or password missing");
            alert.current.hidden = false;
          } else if (error.response?.status === 401) {
            setAlert("An user already exist with this pseudo, please use a different pseudo");
            alert.current.hidden = false;
          } else {
            setAlert("Unknow error, contact an administrator or try again later");
            alert.current.hidden = false;
          }
        });
      }
  }

  return (
    <Container className="align-items-center d-flex" style={{ height: 'calc(100vh - 53px)' }}>
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group className="mb-3">  
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder={"Enter your username"} ref={userInput} required />
        </Form.Group>

        <Form.Group className="mb-3">  
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder={"Enter your password"} ref={pwd} required />
        </Form.Group>
          
        <Form.Group className="mb-3">  
          <Form.Label>Password verification</Form.Label>
          <Form.Control type="password" placeholder={"Verify your password"}ref={pwd2} required />
        </Form.Group>

        <Alert key="alert" variant="danger" style={{marginTop: '5px'}} ref={alert} hidden>
          {alerte}
        </Alert>

        <Stack direction="horizontal" gap={3}>
          <Button type="submit" className="mr-2">Sign Up</Button>
          <CLink to={{ pathname: "/login", state: { referer: referer } }}>Already have an account?</CLink>
        </Stack>

      </Form>
    </Container>
  )
}
