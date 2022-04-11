import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Col, Row, Container, Spinner } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

function Landing() {
    const { t } = useTranslation();


    let history = useHistory();



    //When the app is opened, it checks if the user has a valid token in their local storage,
    //if it is true, it is redirected to the DashBoard, if not, it is redirected to login
    useEffect(() => {


        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
        }

        toLogin()

    }, [history])



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
