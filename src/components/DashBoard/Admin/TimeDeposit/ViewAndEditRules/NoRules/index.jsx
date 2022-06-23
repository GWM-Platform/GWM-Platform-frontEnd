import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const NoRules = ({ motive }) => {
    //To use the translations from i18n
    const { t } = useTranslation();

    return (
        <Container className="h-100">
            <Row className="h-100">
                <Col xs="12" className="h-100 d-flex align-items-center justify-content-center flex-column">
                    <span className="loadingText">{t("There are no rules created yet")}</span>
                    <Button>{t("Create")}</Button>
                </Col>
            </Row>
        </Container>
    )
}
export default NoRules
