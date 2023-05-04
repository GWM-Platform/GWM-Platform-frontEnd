import React, { useState, useEffect, useContext, useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Container, Table } from 'react-bootstrap'
import MovementRow from './MovementRow'
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import { useCallback } from 'react';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import FilterOptions from './FilterOptions';

const AccountMovements = ({ AccountId, ClientId }) => {

    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation();
    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: { movements: 0, total: 0 } }), [])
    const [Movements, setMovements] = useState(initialState)

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const getMovements = useCallback(
        (signal) => {
            axios.get(`/movements`, {
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
                setMovements((prevState) => (
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
                        setMovements((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: { movements: [], total: 0 },
                            }))
                    }


                }
            });
        },
        [AccountId, ClientId, Pagination, toLogin],
    )

    useEffect(() => {
        getMovements();
        return () => {
            setMovements((prevState) => (
                {
                    ...prevState,
                    ...initialState
                }))
        }
        // eslint-disable-next-line
    }, [AccountId, Pagination, getMovements, initialState])

    return (

        <Accordion.Item eventKey="2">
            <Accordion.Header>{t("Cash movements")}</Accordion.Header>
            <Accordion.Body className='px-0'>
                <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                    <div className={`movementsTable growAnimation`}>
                        <Container fluid className='mb-2'>
                            <FilterOptions total={Movements.content.total} keyword={"transactions"} disabled={false} Fund={AccountId} setPagination={setPagination} movsPerPage={Pagination.take} />
                            {
                                Movements.fetching ?
                                    <Loading movements={Decimal(Pagination.take).toNumber()} />
                                    :
                                    Decimal(Movements.content.movements.length).gt(0) ?
                                        <>
                                            <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${Pagination.take + 1} )` }} className={`tableMovements`}>
                                                <Table className="ClientsTable mb-0" striped bordered hover>
                                                    <thead className="verticalTop tableHeader solid-bg">
                                                        <tr>
                                                            <th className="tableId text-nowrap">{t("Ticket")}</th>
                                                            <th className="tableId text-nowrap">{t("Details")}</th>
                                                            <th className="tableHeader">{t("Date")}</th>
                                                            <th className="d-none d-sm-table-cell">{t("Status")}</th>
                                                            <th className="tableHeader">{t("Description")}</th>
                                                            <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
                                                            <th className="tableDescription d-none d-sm-table-cell text-nowrap">{t("Balance")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Movements.content.movements.map((movement, key) => <MovementRow key={`account-movement-${key}`} Movement={movement} />)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </>
                                        :
                                        <NoMovements movements={Decimal(Pagination.take).toNumber()} />
                            }
                            {
                                Movements.content.total > 0 ?
                                    <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Movements.content.total} />
                                    :
                                    null
                            }
                        </Container>
                    </div>
                </div >

            </Accordion.Body>
        </Accordion.Item>

    )
}

export default AccountMovements