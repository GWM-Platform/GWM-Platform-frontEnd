import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Card, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const SourceAccount = ({ Account }) => {
    const { t } = useTranslation();

    return (
        <Container fluid className="px-0">
            <Row className="mx-0 w-100">
            <Col sm="3" className={`py-1 growAnimation  `} >
            <h1>{t("Source account")}</h1>
            <Card
                className={
                    `FundCard h-100 FundSelected`}>
                <Card.Header><strong className="title">{""}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>{t("FeeParts value")}: <strong>${""}</strong></Card.Title>
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-between">
                            <Col md="auto">
                                <Card.Text className="mb-1 feePartsInfo">
                                    <strong>{""}</strong>{" "}{t("in total")}
                                </Card.Text>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </Col>
            </Row>
        </Container>
        
    )
}

export default SourceAccount