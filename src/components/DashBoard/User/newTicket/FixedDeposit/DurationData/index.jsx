import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container, Button, InputGroup } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import moment from 'moment';

const FundSelector = ({ data, Balance, fetching, handleChange, calculateProfit }) => {
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
                                        <span className="number">2</span>
                                    </div>
                                </span>
                                {t("Specify the duration of your investment")}
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
                            value={data.days}
                            step=".01"
                            onChange={handleChange}
                            min="365"
                            max="730"
                            id="days"
                            type="number"
                            required
                            placeholder={t("Days")}
                        />
                        <Form.Control
                            onBlur={() => calculateProfit()}
                            onWheel={event => event.currentTarget.blur()}
                            value={data.until}
                            onChange={handleChange}
                            min={moment().add(365, "days").format("YYYY-MM-DD")}
                            max={moment().add(730, "days").format("YYYY-MM-DD")}
                            id="until"
                            type="date"
                            required
                            placeholder={t("Date")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                data.days === "" ?
                                    t("You must enter how long your investment will last")
                                    :
                                    data.days < 365 ?
                                        t("The minimum duration is 365 days")
                                        :
                                        t("The maximum duration is 730 days")

                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Button disabled={fetching || ((data.amount > Balance) && data.amount > 0)}
                        variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default FundSelector