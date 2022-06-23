import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Accordion, Container, Ratio } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Brush, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import moment from 'moment';
import Decimal from 'decimal.js';


const InvestmentPreview = ({ data, toggleAccordion }) => {

    const { t } = useTranslation();

    const ChartData = () => [
        { date: moment().format("LL"), investment: data.amount },
        {
            date: moment().add(data.days, "days").format("LL"),
            investment:
                (
                    new Decimal(data.amount || 0).add(
                        new Decimal(data.amount || 0).times(new Decimal(data.days|| 0).times(0.02).div(365).toString()).toString()
                    ).toString()
                )
        }
    ]

    return (
        <Accordion.Item eventKey="0" disabled>
            <Accordion.Header onClick={() => toggleAccordion()}>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">3</span>
                                    </div>
                                </span>
                                {t("Investment preview")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <Ratio aspectRatio={9 / 30}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ChartData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="monotone" dataKey="uv" stroke="#808080" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="date" angle={0} dx={20} />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="investment" stroke="#808080" />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                            <Brush />
                        </LineChart>
                    </ResponsiveContainer>
                </Ratio>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default InvestmentPreview