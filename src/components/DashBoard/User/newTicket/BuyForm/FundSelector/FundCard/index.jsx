import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const FundCard = ({ Fund, ownKey, data, setData, openAccordion, Account }) => {
    const { t } = useTranslation();
    const ref = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(ref.current === null ? 200 : ref.current.clientWidth - 20)
    }, [ref]);

    return (
        <Col xs="10" sm="3" className={`py-1 growAnimation  `} >
            <Card
                ref={ref}
                className={
                    `FundCard h-100 
                    ${data.FundSelected === ownKey ? "FundSelected" : ""} 
                    ${Fund.freeShares  === 0 || Fund.sharePrice > Account.balance ? "disabled" : ""}`
                }
                onClick={() => { if (Fund.freeShares > 0) setFundSelected(setData, ownKey, openAccordion) }}>
                <Card.Header><strong className="title">{Fund.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>{t("FeeParts value")}: <strong>${Fund.sharePrice}</strong></Card.Title>
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-between">
                            <Col md="auto">
                                <Card.Text className="mb-1 feePartsInfo">
                                    <strong>{Fund.shares}</strong>{" "}{t("in total")}
                                </Card.Text>
                            </Col>
                        </Row>
                    </Container>
                    {
                        Fund.composition !== undefined
                            ?
                            <DonutChart
                                height={width}
                                width={width}
                                className="w-100 d-block"
                                legend={false}
                                data={Fund.composition}
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

const setFundSelected = (setData, ownKey, openAccordion) => {
    setData((prevState) => ({ ...prevState, ...{ FundSelected: ownKey } }))
    openAccordion()
}

export default FundCard