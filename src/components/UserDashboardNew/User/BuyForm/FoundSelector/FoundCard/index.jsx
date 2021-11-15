import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card, Container, Row } from 'react-bootstrap'

const FoundCard = ({ found, ownKey, data, setData, setSome, some,openAccordion }) => {
    const ref = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(ref.current === null ? 200 : ref.current.clientWidth - 20)
    }, [ref]);

    return (
        <Col sm="3" className="py-1"
            style={{
                pointerEvents: found.freeShares === 0 ? "none" : "all",
                filter: `opacity(${found.freeShares === 0 ? "0.5" : "1"})`
            }}>
            <Card
                ref={ref}
                className={`foundCard h-100 ${data.foundSelected === ownKey ? "foundSelected" : ""}`}
                onClick={() => { setFoundSelected(data, setData, ownKey, setSome, some,openAccordion) }}>
                <Card.Header><strong className="title">{found.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>FeeParts value: <strong>${found.sharePrice}</strong></Card.Title>
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-between">
                            <Col md="auto">
                                <Card.Text className="mb-1 feePartsInfo">
                                    <strong>{found.freeShares}</strong> Available
                                </Card.Text>
                            </Col>
                            <Col md="auto">
                                <Card.Text className="mb-1 feePartsInfo">
                                    <strong>{found.shares}</strong> Total
                                </Card.Text>
                            </Col>
                        </Row>
                    </Container>
                    {
                        found.composition !== undefined
                            ?
                            <DonutChart
                                height={width}
                                width={width}
                                className="w-100 d-block"
                                legend={false}
                                data={found.composition}
                                colors={['#FFA07A', '#FA8072', '#E9967A', '#F08080', '#CD5C5C', '#DC143C', '#B22222', '#FFO000', '#8B0000', '#800000', '#FF6347', '#FF4500', '#DB7093']}
                            />
                            :
                            null
                    }

                </Card.Body>
            </Card>
        </Col>
    )
}

const setFoundSelected = (data, setData, ownKey, setSome, some,openAccordion) => {
    let aux = data
    aux.foundSelected = ownKey
    setData(aux)
    setSome(!some)
    openAccordion()
}

export default FoundCard