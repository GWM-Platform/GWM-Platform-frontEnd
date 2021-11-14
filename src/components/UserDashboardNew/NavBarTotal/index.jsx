import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { useTranslation } from "react-i18next";
import { Navbar, Container,Col,Row } from 'react-bootstrap';

import './index.css'

const NavBarTotal = () => {
    const { t } = useTranslation();

    return (
        <Navbar className="navBarTotal" bg="light">
            <Container className="px-0" fluid>
                <Row className="w-100 mx-0">
                    <Col className="ps-0" md={{spant:"auto",offset:0}} lg={{ span: "auto", offset: 2 }}>
                        <h1 className="total my-0 py-0"> {t("Total Balance")}: $XXXX</h1>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}
export default NavBarTotal


