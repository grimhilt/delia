import { Navigate } from "react-router-dom";
import { CLink } from "../../../styled-components/CLink";
import { Navbar, Container, Stack, ButtonGroup, NavDropdown } from 'react-bootstrap';
import { useUser } from '../../../contexts/UserContext';
import { clearToken } from '../../../utils/useToken';
import { COLORS } from "../../../styles/colors";

export default function Header(props) {
    const [ user, setUser ] = useUser();

    const logOut = () => {
        clearToken();
        setUser({});
        return <Navigate to={"/"} />;
    }

    const style = {};
    style['backgroundColor'] = COLORS.secondary;

    return (
        <Navbar expand="lg" style={style}>
            <Container>
            <Navbar.Brand style={{color: COLORS.text}} href="/">Delia</Navbar.Brand>
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
                    style={{color: COLORS.text}}
                >
                    <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
            :
            <Stack direction="horizontal" gap={3}>
                <CLink to={{ pathname: "/signup" }}>Sign up</CLink>
                <CLink to={{ pathname: "/login" }}>Log in</CLink>
            </Stack>
            }
            </Container>
        </Navbar>
    );
}
