

import React, {
    // useContext,
    useEffect, useMemo
} from "react";
import { useState } from "react";
import {
    Accordion, Button, Col, Form, Row, Table
    // , AccordionContext, useAccordionButton 
} from "react-bootstrap";
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import { useTranslation } from "react-i18next";
import OperationRow from "./Operation";
import Select from 'react-select';
import EmptyTable from "components/DashBoard/GeneralUse/EmptyTable";
import PaginationController from "components/DashBoard/GeneralUse/PaginationController";
import moment from "moment";
import { fetchOperations, selectAllOperations } from "Slices/DashboardUtilities/operationsSlice";
import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchFunds } from "Slices/DashboardUtilities/fundsSlice";

export const OperationsTable = ({ Users, Accounts, Clients, eventOptions }) => {


    const { t } = useTranslation()

    const selectUserById = (userId) => Users.content.find(user => user.id === userId)

    const [validated, setValidated] = useState(false)

    const defaultMinDate = moment().subtract(1, "month").isSameOrAfter(moment("2023-02-01")) ? moment().subtract(1, "month").format(moment.HTML5_FMT.DATE) : "2023-02-01"
    const defaultMaxDate = moment().format(moment.HTML5_FMT.DATE)

    const FilterOptionsDefaultState = {
        client: "",
        type: "",
        disabled: false,
        from: defaultMinDate,
        to: defaultMaxDate
    }

    const [FilterOptions, setFilterOptions] = useState(FilterOptionsDefaultState)

    const fromMinDate = defaultMinDate
    const fromMaxDate = moment(FilterOptions.to).isValid() ? FilterOptions.to : defaultMaxDate

    const toMinDate = moment(FilterOptions.from).isValid() ? FilterOptions.from : defaultMinDate
    const toMaxDate = defaultMaxDate

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of operations)
        take: 15,//Operations per page
    })

    const handleChangeClient = (selectedOption) => {
        setFilterOptions(
            prevState => ({ ...prevState, client: selectedOption })
        )
        setPagination(prevState => ({ ...prevState, skip: 0 }))
    }

    const handleChangeType = (selectedOption) => {
        setFilterOptions(
            prevState => ({ ...prevState, type: selectedOption })
        )
        setPagination(prevState => ({ ...prevState, skip: 0 }))
    }

    const handleChage = (e) => {
        setFilterOptions(prevState => ({ ...prevState, [e.target.id]: e.target.value }))
    }


    const dispatch = useDispatch()
    const operations = useSelector(selectAllOperations)
    const operationsStatus = useSelector(state => state.operations.status)
    const fetchOperationsParams = useMemo(() => ({ ...FilterOptions, ...Pagination }), [FilterOptions, Pagination])
    useEffect(() => {
        dispatch(fetchOperations(fetchOperationsParams))
        // eslint-disable-next-line
    }, [Pagination.skip])

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            setPagination(prevState => ({ ...prevState, skip: 0 }))
        } else {
            setValidated(true)
        }
    }

    const options = [{ label: t("Administrators"), value: "admin" }, ...Clients.content
        .map(client =>
            ({ label: client.alias, value: client.id }))]

    const history = useHistory()

    useEffect(() => {
        dispatch(fetchFunds())
    }, [dispatch])

    return (
        Users.status === "loading" || Accounts.status === "loading" || Clients.status === "loading" ?
            <Loading />
            :
            <Col className="section growOpacity h-100 d-flex flex-column">
                <Accordion style={{ borderBottom: "1px solid #b3b3b3", marginTop: "0.5em", fontSize: "2rem" }} >
                    <ContextAwareToggle eventKey="0" create={() => history.push("/DashBoard/operations/creation")}>
                        {t("Operations")}
                    </ContextAwareToggle>
                    <Accordion.Collapse eventKey="0">
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row className="pt-2 g-2">
                                <Col sm="12" md="6" lg="4">
                                    <Row className="g-2 p-relative">
                                        <Col sm="12" md="6">

                                            <Form.Label>{t("from_date")}</Form.Label>
                                            <Form.Control
                                                placeholder={t('from_date')}
                                                id="from"
                                                type="date"
                                                required
                                                value={FilterOptions.from}
                                                onChange={handleChage}
                                                min={fromMinDate}
                                                max={fromMaxDate}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {t("Enter a valid date range between {{defaultMinDate}} and today", { defaultMinDate })}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col sm="12" md="6">
                                            <Form.Label>{t("to_date")}</Form.Label>
                                            <Form.Control
                                                placeholder={t('to_date')}
                                                id="to"
                                                type="date"
                                                required
                                                value={FilterOptions.to}
                                                onChange={handleChage}
                                                min={toMinDate}
                                                max={toMaxDate}
                                            />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm="12" md="6" lg="4" >
                                    <Form.Label>{t("Client / Administrators")}</Form.Label>
                                    <Select
                                        menuPosition="fixed"
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        isSearchable
                                        alwaysDisplayPlaceholder
                                        noOptionsMessage={() => t("No results")}
                                        placeholder=""
                                        name="Client"
                                        onChange={(selectedOption) => handleChangeClient(selectedOption)}
                                        options={options}
                                        value={FilterOptions.client}
                                        classNames={{
                                            input: () => "react-select-input",
                                        }}
                                        isClearable
                                    />
                                </Col>
                                <Col sm="12" md="6" lg="4" >
                                    <Form.Label>{t("Operation type")}</Form.Label>
                                    <Select
                                        menuPosition="fixed"
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        isSearchable
                                        alwaysDisplayPlaceholder
                                        noOptionsMessage={() => t("No results")}
                                        placeholder=""
                                        name="Type"
                                        onChange={(selectedOption) => handleChangeType(selectedOption)}
                                        options={eventOptions(true)}
                                        value={FilterOptions.type}
                                        classNames={{
                                            input: () => "react-select-input",
                                        }}
                                        isClearable
                                    />
                                </Col>
                                <div className="w-100 m-0" />
                                <Col xs="auto" className="ms-auto">
                                    <Button type="button" onClick={() => setFilterOptions({ ...FilterOptionsDefaultState })}>
                                        Cancelar
                                    </Button>
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit">
                                        Confirmar
                                    </Button>
                                </Col>
                                <div className="w-100 m-0 mb-2" />
                            </Row>
                        </Form>
                    </Accordion.Collapse>
                </Accordion>
                {
                    operationsStatus === "loading" ?
                        <Loading className="h-100 mb-5" />
                        :
                        operations?.operations.length === 0 ?
                            <EmptyTable className="h-100 mb-5" />
                            :
                            <div className="py-3 w-100">
                                <div className="w-100 overflow-auto">
                                    <Table className="ClientsTable mb-0" striped bordered hover>
                                        <thead className="verticalTop tableHeader solid-bg">
                                            <tr>
                                                <th className="id">{t("Date")}</th>
                                                <th className="Alias">{t("User name")}</th>
                                                <th className="Alias">{t("Detail")}</th>
                                                <th className="Balance">{t("Status")}</th>
                                                <th className="Balance">{t("Action")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                operations.operations.map(
                                                    Operation => <OperationRow fetchOperationsParams={fetchOperationsParams} key={`user-operation-${Operation.id}`} User={selectUserById(Operation.userId)} Operation={Operation} Users={Users.content} Accounts={Accounts.content} Clients={Clients.content} />
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={operations?.total} />
                            </div>

                }

            </Col>
    )
}

export const ContextAwareToggle = ({ children, eventKey, callback, create = false, buttonText = "Create operation" }) => {
    const { t } = useTranslation()
    // const { activeEventKey } = useContext(AccordionContext);

    // const decoratedOnClick = useAccordionButton(
    //     eventKey,
    //     () => callback && callback(eventKey),
    // );

    // const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <div
            className="header d-flex " style={{ borderBottom: "unset", padding: "0.5em 0", margin: 0 }}>
            <h1 className="title my-0 fw-normal" style={{ fontSize: "2rem", fontWeight: "300", borderBottom: "unset" }}>{children}</h1>
            {
                create &&
                <Button
                    className="ms-auto"
                    style={{ alignSelf: "center" }}
                    onClick={create}
                    type="button">
                    {t(buttonText)}

                </Button>
            }
        </div>

    );
}
