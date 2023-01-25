import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";

function Home() {
  const [user, setUser] = useUser();
  const [ancdtRooms, setAncdtRooms] = useState([]);

  useEffect(() => {
    if (user?.token) {
      axios({
        method: "get",
        url: "/api/ancdt/rooms",
        params: {
          token: user.token,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setAncdtRooms(res.data);
          }
        })
        .catch((err) => {
          // todo
        });
    }
  }, [user]);

  const ancdtRList = ancdtRooms.map((room) => {
    return (
      <ListGroup.Item key={room.id}>
        <Link to={"/anecdote/" + room.id}>{room.name}</Link>
      </ListGroup.Item>
    );
  });

  return (
    <Card>
      <Card.Header>Anecdotes Rooms: </Card.Header>
      <ListGroup variant="flush">{ancdtRList}</ListGroup>
    </Card>
  );
}

export default Home;
