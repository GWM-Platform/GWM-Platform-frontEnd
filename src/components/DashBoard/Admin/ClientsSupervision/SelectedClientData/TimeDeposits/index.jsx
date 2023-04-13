import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Col, Container, Row } from 'react-bootstrap'
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Loading from 'components/DashBoard/Loading';
import Decimal from 'decimal.js';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import FixedDepositRow from './FixedDepositRow';
import FilterOptions from './FilterOptions';

const TimeDeposits = ({ AccountId, ClientId }) => {

    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation();

    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: {} }), [])
    const [FixedDepositsStats, setFixedDepositsStats] = useState(initialState)

    const initialStateTimeDeposits = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: { deposits: [], total: 0 } }), [])
    const [TimeDeposits, setTimeDeposits] = useState(initialStateTimeDeposits)

    const getFixedDepositStats = useCallback(
        (signal) => {
            axios.get(`/fixed-deposits/stats`, {
                params: {
                    client: ClientId,
                    filterAccount: AccountId,
                    accountId: AccountId
                },
                signal: signal,
            }).then(function (response) {
                setFixedDepositsStats((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response.data,
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") {
                        toLogin()
                    } else {
                        setFixedDepositsStats((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: {},
                            }))
                    }


                }
            });
        },
        [AccountId, ClientId, toLogin],
    )

    useEffect(() => {
        getFixedDepositStats();
        return () => {
            setFixedDepositsStats((prevState) => (
                {
                    ...prevState,
                    ...initialState
                }))
        }
        // eslint-disable-next-line
    }, [AccountId, ClientId, getFixedDepositStats, initialState])

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const getTimeDeposits = useCallback(
        (signal) => {
            axios.get(`/fixed-deposits`, {
                params: {
                    client: ClientId,
                    filterAccount: AccountId,
                    accountId: AccountId,
                    take: Pagination.take,
                    skip: Pagination.skip,
                    filterState: Pagination.state === 10 ? null : Pagination.state,
                    showDenied: Pagination.state === 10 ? true : null
                },
                signal: signal,
            }).then(function (response) {
                setTimeDeposits((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response.data,
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") {
                        toLogin()
                    } else {
                        setTimeDeposits((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: { deposits: [], total: 0 },
                            }))
                    }


                }
            });
        },
        [AccountId, ClientId, Pagination, toLogin],
    )

    useEffect(() => {
        getTimeDeposits();
        return () => {
            setTimeDeposits((prevState) => (
                {
                    ...prevState,
                    ...initialStateTimeDeposits
                }))
        }
        // eslint-disable-next-line
    }, [AccountId, Pagination, getTimeDeposits, initialStateTimeDeposits])

    return (

        <Accordion.Item eventKey="5">
            <Accordion.Header>{t("Time deposits")}</Accordion.Header>
            <Accordion.Body className='px-0'>
                <Container fluid className='mb-2'>
                    <Row className='mb-3' >
                        <Col xs="6">
                            <div className="containerHideInfo description">
                                <span>{t("Balance ($)")}:&nbsp;</span>
                                <span style={{ fontWeight: "bolder" }}>
                                    <FormattedNumber className={`info`} value={FixedDepositsStats?.content?.balance} prefix="" fixedDecimals={2} />
                                </span>

                            </div>
                        </Col>
                        <Col className="ms-auto" xs="auto">
                            {t("Performance")}:&nbsp;
                            <FormattedNumber value={FixedDepositsStats?.content?.performancePercentage || 0} suffix="%" fixedDecimals={2} />
                            &nbsp;(
                            <FormattedNumber value={FixedDepositsStats?.content?.performanceCash || 0} prefix="U$D " fixedDecimals={2} />
                            )
                        </Col>
                        <Col xs="12">
                            {t("Active time deposits")}:&nbsp;
                            {FixedDepositsStats?.content?.activeDeposits}
                        </Col>
                    </Row>
                    <FilterOptions total={TimeDeposits.content.total} keyword={"Time deposits"} disabled={false} Fund={AccountId} setPagination={setPagination} movsPerPage={Pagination.take} />
                    {
                        TimeDeposits.fetching ?
                            <Loading movements={Decimal(Pagination.take).toNumber()} />
                            :
                            Decimal(TimeDeposits.content.deposits.length).gt(0) ?
                                <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${Pagination.take + 1} )` }}
                                    className={`tableMovements w-1 overflow-auto `}>
                                    {TimeDeposits.content.deposits.map((deposit, key) => <FixedDepositRow Movement={deposit} key={`fixed-deposit-${key}`} />)}
                                </div>
                                :
                                <NoMovements movements={Decimal(Pagination.take).toNumber()} />
                    }
                    {
                        TimeDeposits.content.total > 0 ?
                            <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={TimeDeposits.content.total} />
                            :
                            null
                    }
                </Container>
            </Accordion.Body>
        </Accordion.Item>

    )
}

export default TimeDeposits