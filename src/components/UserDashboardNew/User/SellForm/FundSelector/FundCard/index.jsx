import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card, Container, Row } from 'react-bootstrap'

const FundCard = ({ Fund, ownKey, data, setData, setSome, some }) => {
    const ref = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(ref.current === null ? 200 : ref.current.clientWidth - 20)
    }, [ref]);

    return (
        <Col sm="3" className="py-1"
            style={{
                pointerEvents: Fund.freeShares === 0 ? "none" : "all",
                filter: `opacity(${Fund.freeShares === 0 ? "0.5" : "1"})`
            }}>
            <Card
                ref={ref}
                className={`FundCard h-100 ${data.FundSelected === ownKey ? "FundSelected" : ""}`}
                onClick={() => { setFundSelected(data, setData, ownKey, setSome, some) }}>
                <Card.Header><strong className="title">{Fund.fund.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>Obtained FeeParts in cash: <strong>${Fund.fund.sharePrice*Fund.shares}</strong></Card.Title>
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-between">
                            <Col md="auto">
                                <Card.Text className="mb-1 feePartsInfo">
                                    <strong>{Fund.shares}</strong> in posesion
                                </Card.Text>
                            </Col>
                            <Col md="auto">
                                <Card.Text className="mb-1 feePartsInfo">
                                    <strong>${Fund.fund.sharePrice}</strong> Each
                                </Card.Text>
                            </Col>
                        </Row>
                    </Container>
                    {
                        Fund.fund.composition !== undefined
                            ?
                            <DonutChart
                                height={width}
                                width={width}
                                className="w-100 d-block"
                                legend={false}
                                data={Fund.fund.composition}
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

const setFundSelected = (data, setData, ownKey, setSome, some) => {
    let aux = data
    aux.FundSelected = ownKey
    setData(aux)
    setSome(!some)
}

export default FundCard