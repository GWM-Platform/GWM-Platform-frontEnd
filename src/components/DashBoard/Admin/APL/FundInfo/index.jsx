import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
//eslint-disable-next-line
import { Col, Collapse, Row, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DashBoardContext } from 'context/DashBoardContext';

import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import axios from 'axios';
const FundInfo = ({ Fund, clients }) => {
    const { token } = useContext(DashBoardContext)
    // const [Hide, setHide] = useState(false)
    //eslint-disable-next-line
    const [Performance, setPerformance] = useState({ value: 0, fetching: true })
    const balanceInCash = (Fund.freeShares * Fund.sharePrice)
    const clientDebt = Fund.shares - Fund.freeShares
    const clientDebtInCash = (clientDebt * Fund.sharePrice)
    const total = (Fund.shares)
    const totalInCash = (total * Fund.sharePrice)

    // const pending = (Fund.pendingShares || 0)
    // const pendingInCash = (pending * Fund.sharePrice)
    const { t } = useTranslation()
    useEffect(() => {
        //eslint-disable-next-line
        const getPerformance = async () => {
            setPerformance(prevState => ({ ...prevState, ...{ fetching: true, value: 0 } }))
            var url = `${process.env.REACT_APP_APIURL}/funds/${Fund.id}/performance`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setPerformance(prevState => ({ ...prevState, ...{ fetching: false, value: data.toFixed(2) } }))
            } else {
                switch (response.status) {
                    default:
                        setPerformance(prevState => ({ ...prevState, ...{ fetching: false, value: 0 } }))
                        console.error(response.status)
                }
            }
        }
        /*TODO - Show again when the backend is fixed*/
        // getPerformance()
    }, [Fund, token])

    const [open, setOpen] = useState(false)

    const [stakes, setStakes] = useState({ status: "idle", content: [] })

    useEffect(() => {
        setStakes(prevState => ({ ...prevState, ...{ status: "loading" } }))
        axios.get(`/stakes/byFund/${Fund.id}`
            // , { params: { fundId: Fund.id } }
        ).then((response) => {
            setStakes(prevState => ({ ...prevState, ...{ status: "succeeded", content: response.data } }))
        }
        ).catch((err) => {
            setStakes(prevState => ({ ...prevState, ...{ status: "error" } }))
        })
    }, [Fund.id])

    return (
        <div className="fundInfo bg-white info ms-0">
            <div className="d-flex justify-content-between align-items-start">
                <h1 className="m-0 title pe-2">
                    {t("Fund")} "{t(Fund.name)}"
                </h1>
                <h2 className="left">
                    {t("Share price")}
                    <br />
                    <span style={{ fontWeight: "bolder" }}>
                        <FormattedNumber value={Fund.sharePrice} prefix="U$D " fixedDecimals={2} />
                    </span>
                </h2>
            </div>
            <div className='d-flex'>
                <div className='me-4'>
                    <h2 className="mt-2 pe-2 topic">
                        {t("Total")}
                        <br />
                        <span style={{ fontWeight: "bolder" }}>
                            <FormattedNumber value={total} fixedDecimals={2} />
                            &nbsp;{t("shares")}
                        </span>
                    </h2>
                    <h6 className="mt-0">
                        <FormattedNumber value={totalInCash} prefix="U$D " fixedDecimals={2} />
                    </h6>
                </div>
                <div className='me-4'>
                    <h2 className="mt-2 pe-2 topic">
                        {t("Debt")}&nbsp;
                        <span style={{ fontWeight: 200, fontSize: "inherit" }}
                            className='clickable' onClick={() => setOpen(prevState => !prevState)}>
                            {t("Detail")}
                        </span>
                        <br />
                        <span style={{ fontWeight: "bolder" }}>
                            <FormattedNumber value={clientDebt} fixedDecimals={2} />
                            &nbsp;{t("shares")}
                        </span>
                    </h2>
                    <h6 className="mt-0">
                        <FormattedNumber value={clientDebtInCash} prefix="U$D " fixedDecimals={2} />
                    </h6>
                </div>
                <div className='me-4'>
                    <h2 className="mt-2 pe-2 topic">
                        {t("Balance")}
                        <br />
                        <span style={{ fontWeight: "bolder" }}>
                            <FormattedNumber value={Fund.freeShares} fixedDecimals={2} />
                            &nbsp;{t("shares")}
                        </span>
                    </h2>
                    <h6 className="mt-0">
                        <FormattedNumber value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                    </h6>
                </div>

                {/* 
                    TODO - Show again when the backend is fixed
                    <Col sm="auto" >
                        {t("Performance")}{": "}
                        {
                            Performance.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <span
                                    className={{
                                        '1': 'text-green',
                                        '-1': 'text-red'
                                    }[Math.sign(Performance.value)]}>
                                    <FormattedNumber value={Performance.value} suffix="%" fixedDecimals={2} />
                                </span>
                        }
                    </Col>
                */}
            </div>
            <Collapse in={open}>
                <div>
                    <Col className="mb-2" xs="12">
                        <div style={{ borderBottom: "1px solid lightgrey" }} />
                    </Col>
                    <Row>
                        <Col xs="12">
                            <h2 className="fw-normal">
                                {t("Shares by client")}
                            </h2>
                        </Col>
                    </Row>
                    <div className='d-flex flex-wrap'>
                        {
                            stakes.content.map(stake => {
                                const client = clients.find(client => client.id === stake.clientId)
                                return (
                                    <div className='me-4'>
                                        <h2 className="mt-2 pe-2 topic text-nowrap">
                                            {client?.firstName} {client?.lastName}
                                            <br />
                                            <span style={{ fontWeight: "bolder" }}>
                                                <FormattedNumber value={stake?.shares} fixedDecimals={2} />
                                                &nbsp;{t("shares")}
                                            </span>
                                        </h2>
                                        <h6 className="mt-0">
                                            <FormattedNumber value={stake?.shares * (stake.fund.sharePrice || 1)} prefix="U$D " fixedDecimals={2} />
                                        </h6>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Collapse>
        </div>
    )
}
export default FundInfo

