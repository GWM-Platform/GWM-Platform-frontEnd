import React, { useContext } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Navbar, Row, Container, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import ClientSelector from './ClientSelector';
import LanguageSelector from 'components/LanguageSelector';


const NavBarInfo = ({ NavInfoToggled }) => {

    const { t } = useTranslation();
    const { ClientSelected, admin, IndexClientSelected } = useContext(DashBoardContext)

    return (
        <Navbar className={`${NavInfoToggled ? "toggled" : ""} py-0 navBarInfo d-flex justify-content-center`} collapseOnSelect expand="lg" variant="dark">
            <Container fluid>
                <Row className=" w-100 d-flex justify-content-between align-items-center">
                    <Col className="d-flex justify-content-center justify-content-md-end " xs="3" sm="3" md="2" lg="2">
                        <Navbar.Brand>
                            <img
                                alt=""
                                src={process.env.PUBLIC_URL + '/images/logo/logo.svg'}
                                height="50"
                                className="d-inline-block align-top my-2"
                            />
                        </Navbar.Brand>
                    </Col>

                    <Col className="d-flex align-items-center px-0">
                        <div className="d-none d-md-block">
                            <h1 className="greeting p-0 my-0" >
                                {
                                    admin && IndexClientSelected === -1 ?
                                        t("Admin Panel")
                                        :
                                        <>
                                            {t("Hi")},&nbsp;
                                            {`${ClientSelected?.firstName===undefined ? "" : ClientSelected?.firstName === "-" ? "" : ClientSelected?.firstName} 
                                            ${ClientSelected?.lastName===undefined ? "" : ClientSelected.lastName === "-" ? "" : ClientSelected.lastName}`}!</>
                                }
                            </h1>
                        </div>
                        <ClientSelector />
                    </Col>

                    <Col xs="auto" className="d-block d-md-none ms-auto pe-0">
                        <LanguageSelector />
                    </Col>
                </Row>
            </Container>

        </Navbar>
    )
}
export default NavBarInfo
