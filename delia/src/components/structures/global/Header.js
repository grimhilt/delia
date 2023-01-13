import { Link, Navigate } from "react-router-dom";
import { Navbar, Container, Stack, ButtonGroup, NavDropdown } from 'react-bootstrap';
import { useUser } from '../../../contexts/UserContext';
import { clearToken } from '../../../utils/useToken';

export default function Header(props) {
    const [ user, setUser ] = useUser();

    const logOut = () => {
        clearToken();
        setUser({});
        return <Navigate to={"/"} />;
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
            <Navbar.Brand href="/">Delia</Navbar.Brand>
            {user?.username ?
            <Navbar.Collapse className="justify-content-end">
                
                {/* <Navbar.Text>
                    
                </Navbar.Text> */}
                <NavDropdown
                    as={ButtonGroup}
                    // key={"Secondary"}
                    variant="secondary"
                    menuVariant="dark"
                    title={user.username}
                    align="end"
                >
                    <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
            :
            <Stack direction="horizontal" gap={3}>
                <Link to={{ pathname: "/signup" }}>Sign up</Link>
                <Link to={{ pathname: "/login" }}>Log in</Link>
            </Stack>
            }
            </Container>
        </Navbar>
    );
}
