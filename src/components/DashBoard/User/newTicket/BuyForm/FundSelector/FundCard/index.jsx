import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const FundCard = ({ Fund, ownKey, data, setData, openAccordion, Account }) => {
    const { t } = useTranslation();
    const ref = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(ref.current === null ? 200 : ref.current.clientWidth - 20)
    }, [ref]);

    return (
        <Col xs="10" sm="3"
            className={`py-1 pe-1 growAnimation FundCardContainer ${Fund.freeShares === 0 || Fund.sharePrice > Account.balance || Fund.sharePrice === 0 ? " FundDisabled" : ""
                }${data.FundSelectedId === Fund.id ? " FundSelected" : ""
                } 
        `}>
            <Card
                ref={ref}
                className={
                    `FundCard h-100`
                }
                onClick={() => { if (Fund.freeShares > 0) setFundSelected(setData, Fund.id, ownKey, openAccordion) }}>
                <Card.Header><strong className="title">{Fund.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>{t("Share price")}: <strong><FormattedNumber prefix="$" value={Fund.sharePrice} fixedDecimals={2} /></strong></Card.Title>
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

const setFundSelected = (setData, id, key, openAccordion) => {
    setData((prevState) => ({ ...prevState, ...{ FundSelected: key, FundSelectedId: id } }))
    openAccordion()
}

export default FundCard