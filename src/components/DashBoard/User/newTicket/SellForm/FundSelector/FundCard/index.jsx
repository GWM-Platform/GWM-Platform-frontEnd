import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import { Col, Card, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const FundCard = ({ Fund, ownKey, data, setData, setSome, some, openAccordion }) => {
    const { t } = useTranslation();
    const ref = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(ref.current === null ? 200 : ref.current.clientWidth - 20)
    }, [ref]);

    return (

        <Col xs="10" sm="3"
            className={`py-1 growAnimation  FundCardContainer 
        ${Fund.freeShares === 0 ? " FundDisabled" : ""}
        ${data.FundSelected === ownKey ? " FundSelected" : ""} 
        `}>
            <Card
                ref={ref}
                className={`FundCard h-100 `}
                onClick={() => { setFundSelected(data, setData, ownKey, setSome, some, openAccordion) }}>
                <Card.Header><strong className="title">{Fund.fund.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title> {t("Shares")}{": "} <strong>{(Fund.shares).toFixed(2)}</strong></Card.Title>
                    <Card.Title> {t("Holdings value")}{": "} <strong>${(Fund.fund.sharePrice * Fund.shares).toFixed(2)}</strong></Card.Title>
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-between">
                            <Col md="auto">
                                <Card.Text className="mb-1 feePartsInfo">
                                    <strong>${Fund.fund.sharePrice}</strong> {t(" Each")}
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

const setFundSelected = (data, setData, ownKey, setSome, some, openAccordion) => {
    let aux = data
    aux.FundSelected = ownKey
    setData(aux)
    setSome(!some)
    openAccordion()
}

export default FundCard