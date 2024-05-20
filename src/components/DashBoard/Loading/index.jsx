import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Spinner, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Loading = ({ style }) => {
    //To use the translations from i18n
    const { t } = useTranslation();

    return (
        <Container style={style}>
            <Row className="min-100vh d-flex align-items-center">
                <Col xs="12" className="d-flex justify-content-center align-items-center">
                    <Spinner className="me-2" animation="border" variant="primary" />
                    <span className="loadingText">{t("Loading")}</span>
                </Col>
            </Row>
        </Container>
    )
}
export default Loading
