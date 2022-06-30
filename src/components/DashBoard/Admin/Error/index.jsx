import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row,Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Error = () => {
    //To use the translations from i18n
    const { t } = useTranslation();

    return (
        <Container className="h-100">
            <Row className="h-100 d-flex align-items-center">
                <Col xs="12" className="d-flex justify-content-center align-items-center">
                    <span className="loadingText">{t("There was an error, try again later")}</span>
                </Col>
            </Row>
        </Container>
    )
}
export default Error
