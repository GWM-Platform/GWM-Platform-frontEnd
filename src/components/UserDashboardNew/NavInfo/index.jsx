import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Navbar, Row, Container, Col } from 'react-bootstrap'

const NavBarInfo = ({ userData }) => {

    return (
        <Navbar className="py-0 navBarInfo d-flex justify-content-center" collapseOnSelect expand="lg" variant="dark">
            <Container fluid>
                <Row className=" w-100 d-flex justify-content-between align-items-center">
                    <Col xs="3" sm="3" md="2" lg="2">
                        <Navbar.Brand href="" >
                            <img
                                alt=""
                                src={process.env.PUBLIC_URL + '/images/logo/logo.png'}
                                height="70"
                                className="d-inline-block align-top my-2"
                            />
                        </Navbar.Brand>
                    </Col>
                    <Col xs="9" sm="9" md="10" lg="10" className="d-flex align-items-center">
                        <div>
                            <h1 className="greeting p-0 my-0" >
                                Hi,
                                {` ${userData.firstName === undefined ? "" : userData.firstName === "-" ? "" : userData.firstName} 
                                ${userData.lastName === undefined ? "" : userData.lastName === "-" ? "" : userData.lastName}`}!
                                </h1>
                            <h2 className="lastConnection d-none d-sm-none d-md-block">
                                Last login 3 days ago
                            </h2>
                        </div>

                    </Col>
                </Row>
            </Container>

        </Navbar>
    )
}
export default NavBarInfo
