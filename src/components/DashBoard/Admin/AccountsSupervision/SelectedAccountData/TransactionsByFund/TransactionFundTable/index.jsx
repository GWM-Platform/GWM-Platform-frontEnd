import React, { useState, useEffect, useCallback } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Container, Table } from 'react-bootstrap'
import TransactionRow from './TransactionRow'
import { DashBoardContext } from 'context/DashBoardContext';
import { useContext } from 'react';
import { useMemo } from 'react';
import axios from 'axios';
import Decimal from 'decimal.js';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import FilterOptions from './FilterOptions';

const TransactionFundTable = ({ ClientId, FundId }) => {

    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation();

    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: { transactions: 0, total: 0 } }), [])
    const [Transactions, setTransactions] = useState(initialState)

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const getTransactions = useCallback(
        (signal) => {
            axios.get(`/transactions`, {
                params: {
                    client: ClientId,
                    filterFund: FundId,
                    take: Pagination.take,
                    skip: Pagination.skip,
                    filterState:Pagination.state
                },
                signal: signal,
            }).then(function (response) {
                setTransactions((prevState) => (
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
                        setTransactions((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: { transactions: [], total: 0 },
                            }))
                    }


                }
            });
        },
        [FundId, ClientId, Pagination, toLogin],
    )

    useEffect(() => {
        getTransactions();

        return () => {
            setTransactions((prevState) => (
                {
                    ...prevState,
                    ...initialState
                }))
        }
        //eslint-disable-next-line
    }, [getTransactions, Pagination])


    return (
        <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
            <div className={`movementsTable growAnimation`}>
                <Container fluid className='mb-2'>
                    <FilterOptions total={Transactions.content.total} keyword={"transactions"} disabled={false} Fund={FundId} setPagination={setPagination} movsPerPage={Pagination.take} />
                    {
                        Transactions.fetching ?
                            <Loading movements={Decimal(Pagination.take).toNumber()} />
                            :
                            Decimal(Transactions.content.transactions.length).gt(0) ?
                                <>
                                    <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${Pagination.take + 1} )` }} className={`tableMovements`}>
                                        <Table className="AccountsTable mb-0" striped bordered hover>
                                            <thead className="verticalTop tableHeader solid-bg">
                                                <tr>
                                                    <th className="tableHeader text-nowrap">{t("Ticket #")}</th>
                                                    <th className="tableHeader">{t("Date")}</th>
                                                    <th className="d-none d-sm-table-cell">{t("Status")}</th>
                                                    <th className="d-none d-sm-table-cell">{t("Description")}</th>
                                                    <th className="tableDescription d-none d-sm-table-cell text-nowrap">{t("Share price")}</th>
                                                    <th className="tableAmount">{t("Amount")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    Transactions.content.transactions.map((transaction, key) => <TransactionRow key={`account-transaction-${key}`} transaction={transaction} />)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </>
                                :
                                <NoMovements movements={Pagination.take} />
                    }
                    {
                        Transactions.content.total > 0 ?
                            <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Transactions.content.total} />
                            :
                            null
                    }
                </Container>
            </div>
        </div >
    )
}

export default TransactionFundTable