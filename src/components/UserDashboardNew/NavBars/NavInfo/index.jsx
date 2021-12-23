import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Navbar, Row, Container, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';


const NavBarInfo = ({ NavInfoToggled }) => {
    const history = useHistory();

    const { t } = useTranslation();

    const [UserData, setUserData] = useState({})

    useEffect(() => {
        const toLogin = () => {
            sessionStorage.clear(); history.push(`/login`);
        }

        const getUserData = async () => {
            var url = `${process.env.REACT_APP_APIURL}/clients/me`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setUserData(data)
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        const token = sessionStorage.getItem('access_token')
        const admin = JSON.parse(sessionStorage.getItem('admin'))

        if (token === null) toLogin()
        if(!admin){
            getUserData();
        }
    }, [history])

    return (

        <Navbar className={`${NavInfoToggled ? "toggled" : ""} d-none d-sm-block py-0 navBarInfo d-flex justify-content-center`} collapseOnSelect expand="lg" variant="dark">
            <Container fluid>
                <Row className=" w-100 d-flex justify-content-between align-items-center">
                    <Col className="d-flex justify-content-start" xs="3" sm="3" md="2" lg="2">
                        <Navbar.Brand>
                            <img
                                alt=""
                                src={process.env.PUBLIC_URL + '/images/logo/logo.png'}
                                height="50"
                                className="d-inline-block align-top my-2"
                            />
                        </Navbar.Brand>
                    </Col>
                    {
                        UserData.firstName !== undefined ?

                            <Col xs="9" sm="9" md="10" lg="10" className="d-flex align-items-center">
                                <div>
                                    <h1 className="greeting p-0 my-0" >
                                        {t("Hi")},
                                        {` ${UserData.firstName === undefined ? "" : UserData.firstName === "-" ? "" : UserData.firstName} 
                                ${UserData.lastName === undefined ? "" : UserData.lastName === "-" ? "" : UserData.lastName}`}!
                                    </h1>
                                </div>
                            </Col>
                            :
                            null
                    }
                </Row>
            </Container>

        </Navbar>
    )
}
export default NavBarInfo
