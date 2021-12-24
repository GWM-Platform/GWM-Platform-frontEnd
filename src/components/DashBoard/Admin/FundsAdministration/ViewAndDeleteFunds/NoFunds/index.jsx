import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const NoFunds = ({ NavInfoToggled, motive }) => {
    //To use the translations from i18n
    const { t } = useTranslation();

    return (
        <Container className="h-100">
            <Row className="h-100">
                <Col xs="12" className="h-100 d-flex align-items-center justify-content-center">
                    {motive === 0 ?
                        <span className="loadingText">{t("There are no funds created")}</span>
                        :
                        <span className="loadingText">{t("There were no results for your search")}</span>
                    }
                </Col>
            </Row>
        </Container>
    )
}
export default NoFunds
