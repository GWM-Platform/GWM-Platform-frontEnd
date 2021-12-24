import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Navbar, Row, Container, Col } from 'react-bootstrap'

const Footer = () => {

    return (
        <Navbar sticky="bottom" variant="dark" className="d-none d-sm-block navBarFooter">
            <Container>
                <Row className=" w-100 d-flex justify-content-end align-items-center">
                    <Col className="d-flex justify-content-end align-items-center">
                        <span className="text">Copyright © 2021, GWM. All rights reserved</span>
                    </Col>
                </Row>
            </Container>

        </Navbar>
    )
}
export default Footer
