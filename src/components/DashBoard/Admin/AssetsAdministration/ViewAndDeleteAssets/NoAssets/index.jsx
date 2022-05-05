import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row,Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const NoAssets = () => {
    //To use the translations from i18n
    const { t } = useTranslation();

    return (
        <Container>
            <Row>
                <Col xs="12" className="d-flex justify-content-center">
                    <span className="loadingText">{t("There were no results for your search")}</span>
                </Col>
            </Row>
        </Container>
    )
}
export default NoAssets
