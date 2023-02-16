import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container, InputGroup, Button } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const RateData = ({ data, handleChange, calculateProfit, fetching, Balance }) => {
    const { t } = useTranslation();

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">4</span>
                                    </div>
                                </span>
                                {t("Specify the anual rate for your investment")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <div className="formSection">
                    <InputGroup className="mb-3">
                        <Form.Control
                            onBlur={() => calculateProfit()}
                            onWheel={event => event.currentTarget.blur()}
                            value={data.rate}
                            step="0.01"
                            onChange={handleChange}

                            min="0.01"

                            id="rate"
                            type="number"
                            required
                            placeholder={t("Anual rate")}
                        />
                    </InputGroup>
                    {
                        !!(data.preferential) &&
                        <Button disabled={fetching || ((data.amount > Balance) && data.amount > 0)}
                            variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                    }
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default RateData