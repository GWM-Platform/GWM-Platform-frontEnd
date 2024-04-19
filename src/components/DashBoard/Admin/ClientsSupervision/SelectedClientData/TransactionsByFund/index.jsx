import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Col, Container, Row } from 'react-bootstrap'
import TransactionFundTable from './TransactionFundTable';
import axios from 'axios';
import { useMemo } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import FundSelector from './FundSelector';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';
const TransactionsByFund = ({ AccountId, ClientId, clientFunds }) => {
    const { t } = useTranslation();

    const { toLogin } = useContext(DashBoardContext)

    const [FundSelected, setFundSelected] = useState("")

    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: [] }), [])
    const [Funds, setFunds] = useState(initialState)

    useEffect(() => {
        const getFunds = (signal) => {
            axios.get(`/funds`, { signal: signal }).then(function (response) {
                setFunds((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response.data,
                    }))
                setFundSelected(response?.data?.[0]?.id || "")
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") {
                        toLogin()
                    } else {
                        setFunds((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: [],
                            }))
                    }


                }
            });
        }
        getFunds();

        return () => {
            setFunds((prevState) => (
                {
                    ...prevState,
                    initialState
                }))
        }
        //eslint-disable-next-line
    }, [])

    const stake = useMemo(() => clientFunds?.find(clientFund => clientFund?.fundId === FundSelected), [FundSelected, clientFunds])
    const balanceInCash = useMemo(() => stake?.shares ? (stake.shares * stake?.fund?.sharePrice) : 0, [stake?.fund?.sharePrice, stake?.shares])

    return (
        Funds.content.length > 0 &&
        <Accordion.Item eventKey="4">
            <Accordion.Header>{t("Funds")}</Accordion.Header>
            <Accordion.Body className='px-0'>
                <Col md="12">
                    <FundSelector SelectedFund={FundSelected} setSelectedFund={setFundSelected} Funds={Funds.content} clientFunds={clientFunds} />
                </Col>
                {
                    stake &&
                    <>
                        <Container fluid>
                            <Row>
                                <Col xs="12" className='my-3'>
                                    <div style={{ borderBottom: "1px solid lightgray" }}></div>
                                </Col>
                                <Col xs="auto">
                                    {t("Share price")}:&nbsp;
                                    <FormattedNumber style={{ fontWeight: "bolder" }} value={stake.fund.sharePrice} prefix="U$D " suffix="" fixedDecimals={2} />
                                </Col>
                                <Col xs="auto" className='ms-auto'>
                                    {t("Balance (shares)")}:&nbsp;
                                    <FormattedNumber className="bolder" value={stake.shares ? stake.shares : 0} prefix="" fixedDecimals={2} />
                                </Col>
                            </Row>
                        </Container>
                        <Container fluid>
                            <Row>
                                <Col xs="auto">
                                    <span>{t("Balance (U$D)")}:&nbsp;</span>
                                    <FormattedNumber className="bolder" value={balanceInCash.toFixed(2)} prefix="" fixedDecimals={2} />
                                </Col>
                                <Col xs="auto" className='ms-auto'>
                                    <PerformanceComponent numberFw="fw-bold" clientId={ClientId} className='performance-component' text={"Accumulated performance"} fundId={stake.fund.id} />
                                </Col>
                                <Col xs="12" className='my-3'>
                                    <div style={{ borderBottom: "1px solid lightgray" }}></div>
                                </Col>
                            </Row>
                        </Container>
                    </>
                }
                {
                    FundSelected === "" ? null :
                        <TransactionFundTable AccountId={AccountId} ClientId={ClientId} FundId={FundSelected} />
                }
            </Accordion.Body>
        </Accordion.Item >
    )
}

export default TransactionsByFund