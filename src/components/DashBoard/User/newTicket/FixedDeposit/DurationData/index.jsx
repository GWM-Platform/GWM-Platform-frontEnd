import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container, Button, InputGroup } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import moment from 'moment';
import Decimal from 'decimal.js';

const FundSelector = ({ data, Balance, fetching, handleChange, calculateProfit, FixedDepositRules }) => {
    const { t } = useTranslation();

    const selectedRuleIndex = FixedDepositRules.findIndex(rule => (rule === data.ruleSelected))
    const minDuration = data.ruleSelected === "" ? Decimal.min(...[...FixedDepositRules.map(string => parseInt(string)), 365]).toNumber() : parseInt(data.ruleSelected)
    const maxDuration = data.ruleSelected === "" ? Decimal.max(...[...FixedDepositRules.map(string => parseInt(string)), 730]).toNumber() : selectedRuleIndex < FixedDepositRules.length - 1 ? FixedDepositRules[selectedRuleIndex + 1] - 1 : parseInt(data.ruleSelected)

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">3</span>
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
                            step="1"
                            onChange={handleChange}

                            min={minDuration}
                            max={data.preferential ? null : maxDuration}

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

                            min={moment().add(minDuration, "days").format("YYYY-MM-DD")}
                            max={data.preferential ? null : moment().add(maxDuration, "days").format("YYYY-MM-DD")}

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
                                    data.days < minDuration ?
                                        t("The minimum duration is () days", { days: minDuration })
                                        :
                                        data.days > maxDuration ?
                                            t("The maximum duration is () days", { days: maxDuration })
                                            :
                                            t("Decimal values ​​are not allowed")

                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    {
                        !(data.preferential) &&
                        <Button disabled={fetching || ((data.amount > Balance) && data.amount > 0)}
                            variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                    }
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default FundSelector