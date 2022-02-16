import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Navbar, Row, Container, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const {t}=useTranslation()
    return (
        <Navbar sticky="bottom" variant="dark" className="d-none d-sm-block navBarFooter">
            <Container>
                <Row className=" w-100 d-flex justify-content-end align-items-center">
                    <Col className="d-flex justify-content-end align-items-center">
                        <span className="text">Copyright © 2021, GWM. {t("All rights reserved")}</span>
                    </Col>
                </Row>
            </Container>

        </Navbar>
    )
}
export default Footer
