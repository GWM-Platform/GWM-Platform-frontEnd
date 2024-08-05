import React from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Row, Col, Card } from "react-bootstrap";
import './index.css'

const ClientDisabled = () => {
    const { t } = useTranslation()
    return (
        <Container className="ClientSelector growAnimation">
            <Row className="min-100vh d-flex justify-content-center" >
                <Col xs="11" sm="8" md="6" style={{marginTop: "20vh"}}>
                    <Card className="clientSelectorCard">
                        <Card.Body className="p-4">
                            <h1>{t("Client disabled")}</h1>
                            <h2>{t("The client you are trying to use is disabled")}.</h2>
                            <h2>{t("Contact via email or WhatsApp to receive help")}.</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ClientDisabled;