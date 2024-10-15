import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const FundCard = ({ Fund, ownKey, data, setData, openAccordion, Account, accountCardRef }) => {
    const { t } = useTranslation();
    const ref = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(ref.current === null ? 200 : ref.current.clientWidth - 20)
    }, [ref]);

    const { hasBuyPermission } = useContext(DashBoardContext)
    return (
        <Col ref={accountCardRef} xs="10" sm="6" md="4" lg="3"
            className={`py-1 pe-1 growAnimation FundCardContainer ${Fund.freeShares === 0 || Fund.sharePrice > Account.balance || Fund.sharePrice === 0 || Fund.disabled || !hasBuyPermission(Fund.id) ? " FundDisabled" : ""}`}>
            <Card
                ref={ref}
                className={`fund-item p-0 ${data.FundSelectedId === Fund.id ? "selected" : ""}`}
                onClick={() => { if (Fund.freeShares > 0) setFundSelected(setData, Fund.id, ownKey, openAccordion) }}>
                <Card.Header className='content-container d-flex'>
                    <strong className="title d-inline">{Fund.name}</strong>
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
                    <Card.Title>{t("Share price")}: <strong><FormattedNumber prefix="U$D " value={Fund.sharePrice} fixedDecimals={2} /></strong></Card.Title>
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