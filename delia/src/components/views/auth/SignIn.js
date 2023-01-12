import React, { useRef, useState } from 'react'
import { Container, Form, Button, Alert, Stack } from 'react-bootstrap'
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import { default as useToken} from '../../../utils/useToken';
import { useUser } from '../../../contexts/UserContext';


export default function SignIn(props) {

  const username = useRef()
  const pwd = useRef()
  
  const alert = useRef();
  const [alerte, setAlert] = useState();

  const { token, setToken } = useToken();
  const [user, setUser] = useUser();

  let referer = props.location?.state?.referer ?? '/';

  if(token) {
    return <Navigate to={referer} />;
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!username.current?.value || !pwd.current?.value) {
      setAlert("Username or Password Missing")
      alert.current.hidden = false;
    } else {
      axios({
        method: 'post',
        url: '/api/signin',
        data: {
          username: username.current.value,
          pwd: pwd.current.value,
        }
      }).then(res =>{
        if(res.status === 200 && res.statusText === "OK"){
          setToken(res.data["token"]);
          setUser(prevUser => ({
            id: res.data.id,
            username: username.current.value
          }));
        }
      }).catch(error =>{
        if (error.response?.status === 406) {
          setAlert("Username or password missing");
          alert.current.hidden = false;
        } else if (error.response?.status === 401) {
          setAlert("Wrong password or username");
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
          <Form.Control type="text" placeholder={"Enter your username"} ref={username} required />
        </Form.Group>

        <Form.Group className="mb-3">  
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder={"Enter your password"} ref={pwd} required />
        </Form.Group>

        <Alert key="alert" variant="danger" style={{marginTop: '5px'}} ref={alert} hidden>
            {alerte}
        </Alert>

        <Stack direction="horizontal" gap={3}>
          <Button type="submit" className="mr-3">Login</Button>
          <Link to={{ pathname: "/signup", state: { referer: referer } }}>Don't have an account?</Link>
        </Stack>

      </Form>
    </Container>
  )
}
