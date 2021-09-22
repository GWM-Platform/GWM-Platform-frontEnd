import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { Col, Row, Container, Spinner } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { urlContext } from '../../context/urlContext';

function Landing() {
    const { urlPrefix } = useContext(urlContext)

    const { t } = useTranslation();

    const toDashBoard = () => {
        history.push(`/dashboard/accounts`);
    }

    let history = useHistory();

    const toLogin = () => {
        sessionStorage.clear();        history.push(`/login`);
    }

    //When the app is opened, it checks if the user has a valid token in their local storage,
    //if it is true, it is redirected to the dashboard, if not, it is redirected to login

    let token = sessionStorage.getItem('access_token')


    if(token===null){
        toLogin()
    }


    return (
        <Container>
            <Row className="d-flex justify-content-center align-items-center">
                <Col style={{ height: "calc(100vh - 64px)" }} className="d-flex justify-content-center align-items-center">
                    <Spinner className="me-2" animation="border" variant="danger" />
                    <span className="loadingText">{t("Loading")}</span>
                </Col>
            </Row>
        </Container>
    );
}

export default Landing;
