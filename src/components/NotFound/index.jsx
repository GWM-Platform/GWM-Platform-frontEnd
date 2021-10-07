import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '@fortawesome/free-solid-svg-icons'
import { Container,Row,Col } from 'react-bootstrap'
import './index.css'

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <Container className="notFound">
            <Row className="free-area d-flex justify-content-center align-items-center">
                <Col sm="auto">                     
                    <FontAwesomeIcon icon={faFrown} className="icon"/>
                    <h1 className="title">Error 404</h1>
                    <h2 className="description">{t("Not Found")}</h2>
                </Col>
            </Row>
        </Container>
    )
}
export default NotFound
