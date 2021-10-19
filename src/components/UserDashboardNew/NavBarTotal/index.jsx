import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { useTranslation } from "react-i18next";
import { Navbar, Container } from 'react-bootstrap';

import './index.css'

const NavBarTotal = () => {
    return (
        <Navbar className="navBarTotal" bg="light">
            <Container>
                <Navbar.Brand> Total Balance: $XXXX</Navbar.Brand>
            </Container>
        </Navbar>
    )
}
export default NavBarTotal



