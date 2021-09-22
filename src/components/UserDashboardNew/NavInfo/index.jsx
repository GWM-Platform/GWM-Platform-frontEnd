import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Navbar, Row, Container, Col } from 'react-bootstrap'

const NavBarInfo = ({ userData }) => {

    return (
        <Navbar className="py-0 navBarInfo d-flex justify-content-center" collapseOnSelect expand="lg" variant="dark">
            <Container fluid>
                <Row className=" w-100 d-flex justify-content-between align-items-center">
                    <Col  md="1" lg="2">
                        <Navbar.Brand href="" >
                            <img

                                alt=""
                                src={process.env.PUBLIC_URL + '/images/logo/logo.png'}
                                height="70"
                                className="d-inline-block align-top my-2"
                            />
                        </Navbar.Brand>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <div>
                            <h1 className="greeting p-0 my-0" >
                                Hi,
                                {` ${userData.firstName === undefined ? "" : userData.firstName === "-" ? "" : userData.firstName} 
                                ${userData.lastName === undefined ? "" : userData.lastName === "-" ? "" : userData.lastName}`}!
                                </h1>
                            <h2 className="lastConnection">
                                Last login 3 days ago
                            </h2>
                        </div>

                    </Col>
                    {/*<Col className="ms-auto image d-flex justify-content-center">
                        <img
                            height="80"
                            src={process.env.PUBLIC_URL + '/images/logo/GWM.png'}
                            alt="" />
                    </Col>*/}
                </Row>
            </Container>

        </Navbar>
    )
}
export default NavBarInfo
