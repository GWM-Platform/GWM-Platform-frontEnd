import React, { useMemo, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import enrichAccount from 'utils/enrichAccount';

const AccountCard = ({ data, setData, openAccordion, accountCardRef }) => {
    const { t } = useTranslation();
    const ref = useRef(null)

    const { hasPermission, AccountSelected } = useContext(DashBoardContext)

    const AccountSelectedEnriched = useMemo(() =>
        enrichAccount(AccountSelected), [AccountSelected])

    return (

        <Col xs="10" sm="6" md="4" lg="3" ref={accountCardRef}
            className={`py-1 growAnimation  FundCardContainer 
        ${!hasPermission('TRANSFER_GENERATE') ? " FundDisabled" : ""}
        ${data.FundSelected === "cash" ? " FundSelected" : ""} 
        `}>
            <Card
                ref={ref}
                className={`fund-item p-0 ${data.FundSelected === "cash" ? "selected" : ""}`}
                onClick={() => { setFundSelected(setData, "cash", openAccordion) }}>

                <Card.Header className='content-container d-flex'>
                    <strong className="title d-inline">{t("Cash")}</strong>
                    <div className="fund-icon ms-auto">
                        <img alt="" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Title> {t("Balance")}{": "} <strong><FormattedNumber className="text-nowrap" prefix="U$D " value={AccountSelectedEnriched?.balance || 0} fixedDecimals={2} /></strong></Card.Title>
                    {AccountSelectedEnriched?.totalAvailable !== AccountSelectedEnriched?.balance &&
                        <Card.Title> {t("Available funds")}{": "} <strong><FormattedNumber className="text-nowrap" prefix="U$D " value={AccountSelectedEnriched?.totalAvailable || 0} fixedDecimals={2} /></strong></Card.Title>
                    }
                </Card.Body>
            </Card>
        </Col>
    )
}

const setFundSelected = (setData, ownKey, openAccordion) => {
    setData(prevState => ({ ...prevState, FundSelected: ownKey, usd_value: "", usd_amount: "", amount: "", value: "" }))
    openAccordion()
}

export default AccountCard