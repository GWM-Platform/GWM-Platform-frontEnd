import React, { useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const AccountCard = ({ data, setData, openAccordion }) => {
    const { t } = useTranslation();
    const ref = useRef(null)

    const { hasPermission, AccountSelected } = useContext(DashBoardContext)

    return (

        <Col xs="10" sm="6" md="4" lg="3"
            className={`py-1 growAnimation  FundCardContainer 
        ${!hasPermission('TRANSFER_GENERATE') ? " FundDisabled" : ""}
        ${data.FundSelected === "cash" ? " FundSelected" : ""} 
        `}>
            <Card
                ref={ref}
                className={`FundCard h-100 `}
                onClick={() => { setFundSelected(setData, "cash", openAccordion) }}>
                <Card.Header><strong className="title">{t("Cash")}</strong></Card.Header>
                <Card.Body>
                    <Card.Title> {t("Holding")}{": "} <strong><FormattedNumber prefix="U$D " value={AccountSelected?.balance || 0} fixedDecimals={2} /></strong></Card.Title>
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