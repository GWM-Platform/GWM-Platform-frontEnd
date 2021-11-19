import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '@fortawesome/free-regular-svg-icons'
import { Container,Row,Col } from 'react-bootstrap'
import './index.css'

const NotFund = () => {
    const { t } = useTranslation();

    return (
        <Container className="notFund">
            <Row className="min-100vh d-flex justify-content-center align-items-center">
                <Col sm="auto">                     
                    <FontAwesomeIcon icon={faFrown} className="icon"/>
                    <h1 className="title">Error 404</h1>
                    <h2 className="description">{t("Not Fund")}</h2>
                </Col>
            </Row>
        </Container>
    )
}
export default NotFund
