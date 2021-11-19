import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Form } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const WithDrawForm = ({NavInfoToggled}) => {

    const { t } = useTranslation();


    return (
        <Container >
            <Row className={`${NavInfoToggled? "free-area-withoutNavInfo": "free-area"} newTicket d-flex justify-content-center`}>
                <Col sm="9">
                    <div className="formSection">
                        <Row className="d-flex justify-content-center">
                            <Form.Label className="mb-3 pt-0 label d-flex align-items-center" column sm="auto">
                                <div className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">1</span>
                                    </div>
                                </div>
                                {t("Select Fund To buy")}
                            </Form.Label>
                            <div>
                                <Row className="d-flex justify-content-center">
                                    <h1>Contenido form depositar</h1>
                                </Row>
                            </div>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
export default WithDrawForm