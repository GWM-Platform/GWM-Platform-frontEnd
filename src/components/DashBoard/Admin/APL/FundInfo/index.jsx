import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
//eslint-disable-next-line
import { ButtonGroup, Col, Collapse, Row, Spinner, Table, ToggleButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DashBoardContext } from 'context/DashBoardContext';

import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import Decimal from 'decimal.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFundHistory, selectFundHistoryByFundId } from 'Slices/DashboardUtilities/fundHistorySlice';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from '../../Loading';
import moment from 'moment';
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
    const [openHistoricPrices, setOpenHistoricPrices] = useState(false)

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

    const [tableView, setTableView] = useState(true)

    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const sortData = (field) => {
        if (sortField === field && sortDirection === 'desc') {
            setSortField(null);
            setSortDirection('asc');
        }
        else {
            let direction = 'asc';
            if (sortField === field && sortDirection === 'asc') {
                direction = 'desc';
            }
            setSortField(field);
            setSortDirection(direction);
        }
    };

    const sortedStakes = useMemo(() => (
        [...stakes.content].map(stake => {
            const client = clients.find(client => client.id === stake.clientId)
            return ({ ...stake, client, clientCompleteName: `${client.firstName} ${client.lastName}` })
        }).sort((a, b) => {
            if (sortField && a[sortField] && b[sortField]) {
                if (typeof a[sortField] === 'string') {
                    return sortDirection === 'asc' ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
                } else {
                    return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
                }
            }
            return 0;
        })
    ), [clients, sortDirection, sortField, stakes.content])

    const totalStakes = useMemo(() => (
        [...stakes.content || []]
            .reduce((accum, stake) => ({ shares: accum.shares.add(stake.shares), usd: accum.usd.add(stake?.shares * (stake.fund.sharePrice || 1)) }), { shares: Decimal(0), usd: Decimal(0) })
    ), [stakes.content])

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                document.getElementById("client-holdings-table").scrollIntoView({ behavior: "smooth" })
            }, 100);
        }
    }, [open])
    return (
        <>
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
                        <br />
                        <span style={{ fontWeight: 200, fontSize: "inherit" }}
                            className='clickable' onClick={() => setOpenHistoricPrices(prevState => !prevState)}>
                            {t("Historic prices")}
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
                <Collapse in={open} id="client-holdings-table" >
                    <div>
                        <Col className="mb-2" xs="12">
                            <div style={{ borderBottom: "1px solid lightgrey" }} />
                        </Col>
                        <Row className='align-iteems-center'>
                            <Col xs="auto">
                                <h2 className="fw-normal">
                                    {t("Shares by client")}
                                </h2>
                            </Col>
                            <Col className="ms-auto" xs="auto">
                                <ButtonGroup>
                                    <ToggleButton
                                        type="radio"
                                        style={{ lineHeight: "1em", display: "flex" }}
                                        variant="outline-primary"
                                        name="radio"
                                        value={true}
                                        checked={tableView}
                                        active={tableView}
                                        onClick={(e) => setTableView(true)}
                                        title={t("Table View")}
                                    >
                                        <img src={`${process.env.PUBLIC_URL}/images/generalUse/table${tableView ? "" : "-active"}.svg`} alt="performance" />
                                    </ToggleButton>
                                    <ToggleButton
                                        style={{ lineHeight: "1em", display: "flex" }}
                                        type="radio"
                                        variant="outline-primary"
                                        name="radio"
                                        value={false}
                                        checked={!tableView}
                                        active={!tableView}
                                        onClick={(e) => setTableView(false)}
                                        title={t("Grid View")}
                                    >
                                        <img src={`${process.env.PUBLIC_URL}/images/generalUse/grid${tableView ? "-active" : ""}.svg`} alt="performance" />
                                    </ToggleButton>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        {
                            tableView ?
                                <Table striped bordered hover className="mb-auto m-0 mt-2" >
                                    <thead >
                                        <tr>
                                            <th className="tableHeader" onClick={() => sortData('clientCompleteName')} style={{ cursor: "pointer" }}>
                                                <span className='d-flex'>

                                                    <span>
                                                        {t("Client")}
                                                    </span>
                                                    <FontAwesomeIcon className='ms-auto' icon={sortField === "clientCompleteName" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                </span>
                                            </th>
                                            <th className="tableHeader" onClick={() => sortData('shares')} style={{ cursor: "pointer" }}>
                                                <span className='d-flex'>
                                                    <span>
                                                        {t("Shares holding")}
                                                    </span>
                                                    <FontAwesomeIcon className="ms-auto" icon={sortField === "shares" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                </span>
                                            </th>
                                            <th className="tableHeader" onClick={() => sortData('shares')} style={{ cursor: "pointer" }}>
                                                <span className='d-flex'>
                                                    <span>
                                                        {t("Dolarized")}
                                                    </span>
                                                    <FontAwesomeIcon className="ms-auto" icon={sortField === "shares" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sortedStakes.map(stake => {

                                                return (
                                                    <tr key={stake.clientId}>
                                                        <td className="tableDate">{stake?.clientCompleteName}</td>
                                                        <td className="tableDate"><FormattedNumber value={stake?.shares} fixedDecimals={2} />&nbsp;{t("shares")}</td>
                                                        <td className="tableDate"><FormattedNumber value={stake?.shares * (stake.fund.sharePrice || 1)} prefix="U$D " fixedDecimals={2} /></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr >
                                            <td className="tableDate"><strong>Total</strong></td>
                                            <td className="tableDate"><strong><FormattedNumber value={totalStakes?.shares} fixedDecimals={2} />&nbsp;{t("shares")}</strong></td>
                                            <td className="tableDate"><strong><FormattedNumber value={totalStakes.usd} prefix="U$D " fixedDecimals={2} /></strong></td>
                                        </tr>
                                    </tbody>
                                </Table>
                                :
                                <div className='d-flex flex-wrap'>
                                    {
                                        sortedStakes.map(stake => {
                                            return (
                                                <div className='me-4' key={stake.clientId}>
                                                    <h2 className="mt-2 pe-2 topic text-nowrap">
                                                        {stake?.clientCompleteName}
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

                        }
                    </div>
                </Collapse>
            </div>
            <FundHistory Fund={Fund} open={openHistoricPrices} />
        </>
    )
}
export default FundInfo

const FundHistory = ({ Fund, open }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [sortField, setSortField] = useState('priceDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const sortData = (field) => {
        if (sortField === field && sortDirection === 'desc') {
            setSortField(null);
            setSortDirection('asc');
        }
        else {
            let direction = 'asc';
            if (sortField === field && sortDirection === 'asc') {
                direction = 'desc';
            }
            setSortField(field);
            setSortDirection(direction);
        }
    };

    const fundHistory = useSelector(state => selectFundHistoryByFundId(state, Fund?.id))
    const fundHistoryStatus = useSelector(state => state.fundHistory.status)

    const sortedFundPrices = useMemo(() => (
        [...fundHistory || [], {
            id: -1,
            today: true,
            priceDate: t('Today'),
            sharePrice: Fund?.sharePrice || 0
        }].sort((a, b) => {
            if (sortField && a[sortField] && b[sortField]) {
                if (typeof a[sortField] === 'string') {
                    return sortDirection === 'asc' ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
                } else {
                    return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
                }
            }
            return 0;
        })
    ), [Fund?.sharePrice, fundHistory, sortDirection, sortField, t])
    useEffect(() => {
        if (fundHistoryStatus === 'idle') {
            dispatch(fetchFundHistory())
        }
    }, [dispatch, fundHistoryStatus])

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                document.getElementById("historic-prices-table").scrollIntoView({ behavior: "smooth" })
            }, 100);
        }
    }, [open])


    return (
        <Collapse in={open} id="historic-prices-table" style={{ scrollMarginTop: "1rem", overflow: "clip" }}>
            <div className='transaction-table box-shadow mb-2 mt-4' >
                <h1 className="m-0 title pe-2">{t("Historic prices")}</h1>
                {
                    fundHistoryStatus === "loading" ?
                        <Loading movements={5} />
                        :
                        fundHistory.length > 0 ?
                            <Table striped bordered hover className="mb-auto m-0 mt-2" >
                                <thead >
                                    <tr>
                                        <th className="tableHeader" onClick={() => sortData('priceDate')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Date")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "priceDate" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="tableHeader" onClick={() => sortData('sharePrice')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Price")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "sharePrice" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        sortedFundPrices.map(stake => {
                                            return (
                                                <tr key={stake.id}>
                                                    <td className="tableDate">
                                                        {stake.today ? stake.priceDate : moment(stake.priceDate).format('L')}
                                                    </td>
                                                    <td className="tableDate"><FormattedNumber value={stake?.sharePrice} prefix="U$D " fixedDecimals={2} /></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            :
                            <NoMovements movements={5} />
                }
            </div>
        </Collapse>
    )
}

