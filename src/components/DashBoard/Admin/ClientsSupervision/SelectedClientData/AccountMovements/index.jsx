import React, { useState, useEffect, useContext, useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap'
import MovementRow from './MovementRow'
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import { useCallback } from 'react';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import FilterOptions from './FilterOptions';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import ReactPDF from '@react-pdf/renderer';
import MovementTable from 'TableExport/MovementTable';
import { PrintButton } from 'utils/usePrint';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { exportToExcel } from 'utils/exportToExcel';

const AccountMovements = ({ AccountId, ClientId, Account, Client }) => {

    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation();
    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: { movements: 0, total: 0 } }), [])
    const [Movements, setMovements] = useState(initialState)

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 100,//Movements per page
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [AccountId, ClientId, Pagination],
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

    const [rendering, setRendering] = useState(false)
    const { getMoveStateById } = useContext(DashBoardContext)

    const renderAndDownloadTablePDF = async () => {
        setRendering(true)
        const blob = await ReactPDF.pdf(
            <MovementTable
                movements={Movements.content.movements}
                headerInfo={{
                    clientName:
                        `${Client?.firstName === undefined ? "" : Client?.firstName === "-" ? "" : Client?.firstName
                        }${Client?.lastName === undefined ? "" : Client?.lastName === "-" ? "" : ` ${Client?.lastName}`
                        }`,
                    balance: (Account?.balance || 0) + ""
                }} getMoveStateById={getMoveStateById} />).toBlob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${t("Cash_movements")}.pdf`)
        // 3. Append to html page
        document.body.appendChild(link)
        // 4. Force download
        link.click()
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link)
        setRendering(false)
    }

    return (

        <Accordion.Item eventKey="2">
            <Accordion.Header>{t("Cash")}</Accordion.Header>
            <Accordion.Body className='px-0'>
                <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                    <div className={`movementsTable growAnimation`}>
                        <Container fluid className='mb-2'>
                            {
                                Account &&
                                <Row>
                                    <Col xs="auto">
                                        {t("Balance")}:&nbsp;
                                        <FormattedNumber style={{ fontWeight: "bolder" }} value={Account?.balance} prefix="U$D " suffix="" fixedDecimals={2} />
                                        <br />
                                        {t("Overdraft")}:&nbsp;
                                        <FormattedNumber style={{ fontWeight: "bolder" }} value={Account?.overdraft} prefix="U$D " suffix="" fixedDecimals={2} />
                                    </Col>
                                    {
                                        Movements?.content?.movements?.length > 0 &&
                                        <>
                                            <Col xs="auto" className='ms-auto'>
                                                {
                                                    rendering ?
                                                        <Spinner animation="border" size="sm" />
                                                        :
                                                        <PrintButton className="w-100" variant="info" handlePrint={renderAndDownloadTablePDF} />
                                                }
                                            </Col>
                                            <Col xs="auto" className='ps-0'>
                                                <Button className="me-2 print-button no-style" variant="info" onClick={() => exportToExcel(
                                                    {
                                                        filename: `${t("Cash_movements")} ${Client?.firstName === undefined ? "" : Client?.firstName === "-" ? "" : Client?.firstName}${Client?.lastName === undefined ? "" : Client?.lastName === "-" ? "" : ` ${Client?.lastName}`}`,
                                                        sheetName: `${t("Cash_movements")} ${Client?.firstName === undefined ? "" : Client?.firstName === "-" ? "" : Client?.firstName}${Client?.lastName === undefined ? "" : Client?.lastName === "-" ? "" : ` ${Client?.lastName}`}`,
                                                        dataTableName: "cta-cte-movements",
                                                        excludedColumns: ["ticket", "actions"],
                                                        // plainNumberColumns: ["unit_floor", "unit_unitNumber", "unit_typology"]
                                                    }

                                                )} >
                                                    <FontAwesomeIcon icon={faFileExcel} />
                                                </Button>
                                            </Col>
                                        </>
                                    }

                                    <Col xs="12" className='my-3'>
                                        <div style={{ borderBottom: "1px solid lightgray" }}></div>
                                    </Col>
                                </Row>
                            }
                            <FilterOptions total={Movements.content.total} keyword={"transactions"} disabled={false} Fund={AccountId} setPagination={setPagination} movsPerPage={Pagination.take} />
                            {
                                Movements.fetching ?
                                    <Loading movements={Decimal(Pagination.take).toNumber()} />
                                    :
                                    Decimal(Movements.content.movements.length).gt(0) ?
                                        <>
                                            <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${Pagination.take + 1} )` }} className={`tableMovements`}>
                                                <Table className="ClientsTable mb-0" striped bordered hover data-table-name="cta-cte-movements">
                                                    <thead className="verticalTop tableHeader solid-bg">
                                                        <tr>
                                                            <th className="tableId text-nowrap" data-column-name="ticket">{t("Ticket")}</th>
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