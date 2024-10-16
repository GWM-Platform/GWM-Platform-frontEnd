import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import { Col, Card, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js'

const FundCard = ({ Fund, ownKey, data, setData, setSome, some, openAccordion, accountCardRef }) => {
    const { t } = useTranslation();
    const ref = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(ref.current === null ? 200 : ref.current.clientWidth - 20)
    }, [ref]);

    const { hasSellPermission } = useContext(DashBoardContext)

    return (

        <Col xs="10" sm="6" md="4" lg="3" ref={accountCardRef}
            className={`py-1 growAnimation  FundCardContainer 
        ${Fund.freeShares === 0 || !hasSellPermission(Fund.fund.id) || Fund.fund?.disabled ? " FundDisabled" : ""}`}>
            <Card
                ref={ref}
                className={`fund-item p-0 ${data.FundSelected === ownKey ? "selected" : ""}`}
                onClick={() => { setFundSelected(data, setData, ownKey, setSome, some, openAccordion) }}>
                <Card.Header className='content-container d-flex'>
                    <strong className="title d-inline">{Fund.fund.name}</strong>
                    <div className="fund-icon ms-auto">
                        {
                            <img alt=""
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = process.env.PUBLIC_URL + '/images/FundsLogos/default.svg';
                                }}
                                src={Fund.imageUrl ? Fund.imageUrl : process.env.PUBLIC_URL + '/images/FundsLogos/default.svg'} />
                        }
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Title> {t("Shares")}{": "} <strong>{<FormattedNumber rounding="ROUND_DOWN" value={(Fund.shares)} fixedDecimals={2} />}</strong></Card.Title>
                    <Card.Title> {t("Holdings value")}{": "} <strong><FormattedNumber prefix="U$D " value={(Decimal(Fund.shares || 0).times(Fund.fund.sharePrice || 1))} fixedDecimals={2} /></strong></Card.Title>
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-between">
                            <Col md="auto">
                                <Card.Text className="mb-1 sharesInfo">
                                    <strong>
                                        <FormattedNumber prefix="U$D " value={Fund.fund.sharePrice} fixedDecimals={2} />
                                    </strong> {t(" Each")}
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