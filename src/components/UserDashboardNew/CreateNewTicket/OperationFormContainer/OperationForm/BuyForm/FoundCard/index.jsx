import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card, Form, FloatingLabel,Row } from 'react-bootstrap'

const FoundCard = ({ found, ownKey, data, setData, some, setSome }) => {
    return (
        <Col sm="5">
            <Card className="text-center foundCard">
                <Card.Header><strong className="title">{found.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>FeeParts value: <strong>${found.feePartsValue}</strong></Card.Title>

                    <Card.Text className="mb-1">
                        <strong>{found.feePartsAvalilable}</strong> FeeParts available

                    </Card.Text>

                    <Card.Text className="mb-1">
                        <strong>{found.totalFeeParts}</strong> Feeparts in total
                    </Card.Text>

                    <DonutChart
                        className="d-block w-100"
                        legend={false}
                        data={found.composition}
                        height={200}
                        width={200} />
                </Card.Body>
                <Card.Footer className="mb-0 d-flex justify-content-center">
                    <Row>
                        <Col sm="12" className="mb-3 d-flex justify-content-start mx-auto">
                            <Form.Check
                                type="checkbox"
                                id={`default -checkbox`}
                                label={`Buy feeparts`}
                            />
                        </Col>
                        <Col sm="12">
                            <FloatingLabel
                                controlId="Quantity"
                                label="Quantity"
                                className="mb-3"
                            >
                                <Form.Control type="email" placeholder="name@example.com" />
                            </FloatingLabel>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>
    )
}

const setTypeSelected = (data, setData, ownKey, some, setSome) => {
    let aux = data
    aux.type = ownKey
    setData(aux)
    setSome(!some)
}
export default FoundCard