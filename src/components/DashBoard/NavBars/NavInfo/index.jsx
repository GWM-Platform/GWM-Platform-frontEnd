import React, { useContext } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'

import { Navbar, Row, Container, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import ClientSelector from './ClientSelector';
import LanguageSelector from 'components/LanguageSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useRouteMatch } from 'react-router';
import NotificationsCenter from '../NavBar/NotificationsCenter';


const NavBarInfo = ({ NavInfoToggled }) => {

    const { t } = useTranslation();
    const { ClientSelected, admin, IndexClientSelected } = useContext(DashBoardContext)

    const { url } = useRouteMatch()
    let history = useHistory();

    const toSettings = () => {
        history.push(`${url}/Configuration`);
    }

    return (
        <Navbar className={`${NavInfoToggled ? "toggled" : ""} py-0 navBarInfo d-flex justify-content-center`} collapseOnSelect expand="lg" variant="dark">
            <Container fluid>
                <Row className=" w-100 d-flex justify-content-between align-items-center flex-nowrap flex-grow-1">
                    <Col className="d-flex justify-content-center justify-content-md-end imageContainer" xs="auto" sm="3" md="2" lg="2">
                        <Navbar.Brand>
                            <img
                                alt=""
                                src={process.env.PUBLIC_URL + '/images/logo/logo.svg'}
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
                                            {`${ClientSelected?.firstName === undefined ? "" : ClientSelected?.firstName === "-" ? "" : ClientSelected?.firstName} 
                                            ${ClientSelected?.lastName === undefined ? "" : ClientSelected.lastName === "-" ? "" : ClientSelected.lastName}`}!</>
                                }
                            </h1>
                        </div>
                        <ClientSelector />
                    </Col>
                    <Col xs="auto" className="d-block d-sm-none ms-auto pe-0">
                        <NotificationsCenter />
                    </Col>
                    <Col xs="auto" className="d-block d-md-none ms-auto pe-0">
                        <div className="d-flex justify-content-center" onClick={() => toSettings()}>
                            <FontAwesomeIcon className="icon" icon={faCog} />
                        </div>
                    </Col>
                    <Col xs="auto" className="d-block d-md-none">
                        <LanguageSelector />
                    </Col>
                </Row>
            </Container>

        </Navbar>
    )
}
export default NavBarInfo
