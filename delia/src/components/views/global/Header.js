import { Link } from "react-router-dom";
import { Navbar, Container, Stack } from 'react-bootstrap';
import { useUser } from '../../../contexts/UserContext';

export default function Header(props) {
    const [user, setUser] = useUser();

    return (
        <Navbar bg="light" expand="lg">
            <Container>
            <Navbar.Brand href="/">Delia</Navbar.Brand>
            {user?.username ?
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: {user.username}
                </Navbar.Text>
            </Navbar.Collapse>
            :
            <Stack direction="horizontal" gap={3}>
                <Link to={{ pathname: "/signup" }}>Sign up</Link>
                <Link to={{ pathname: "/signin" }}>Log in</Link>
            </Stack>
            }
            </Container>
        </Navbar>
    );
}
