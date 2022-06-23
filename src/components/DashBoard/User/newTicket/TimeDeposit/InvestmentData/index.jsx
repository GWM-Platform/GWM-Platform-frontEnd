import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const InvestmentData = ({ data, handleChange, Balance }) => {

    const { t } = useTranslation();

    return (
        <Accordion.Item eventKey="0" disabled>
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">1</span>
                                    </div>
                                </span>
                                {t("Specify the amount you want to invest")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text>U$D</InputGroup.Text>
                    <Form.Control
                        onWheel={event => event.currentTarget.blur()}
                        value={data.amount}
                        step=".01"
                        onChange={handleChange}
                        min="1"
                        max={Balance}
                        id="amount"
                        type="number"
                        required
                        placeholder={t("Amount")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {

                            data.amount === "" ?
                                t("You must enter how much you want to invest")
                                :
                                data.amount <= 0 ?
                                     t("The value must be greater than 0") 
                                    :
                                    data.amount > Balance ?
                                        t("You only have") + " U$D " + Balance + " " + t("available in your account.")
                                        :
                                        t("The min step is 0.01")
                        }
                    </Form.Control.Feedback>
                </InputGroup>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default InvestmentData