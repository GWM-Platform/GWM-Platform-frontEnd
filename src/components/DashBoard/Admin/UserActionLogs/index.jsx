
import axios from "axios";
import React, { useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { Accordion, AccordionContext, Button, Col, Container, Form, Row, Table, useAccordionButton } from "react-bootstrap";
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from "context/DashBoardContext";
import UserActionLog from "./UserActionLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import EmptyTable from "components/DashBoard/GeneralUse/EmptyTable";
import PaginationController from "components/DashBoard/GeneralUse/PaginationController";
import moment from "moment";

const UserActionLogs = () => {

    const { t } = useTranslation();

    const { toLogin } = useContext(DashBoardContext)

    const [Events, setEvents] = useState({ status: "idle", content: { events: [], total: 0 } })

    const [validated, setValidated] = useState(false)

    const defaultMinDate = moment().subtract(1, "month").isSameOrAfter(moment("2023-02-01")) ? moment().subtract(1, "month").format(moment.HTML5_FMT.DATE) : "2023-02-01"
    const defaultMaxDate = moment().format(moment.HTML5_FMT.DATE)

    const FilterOptionsDefaultState = {
        client: "",
        type: "",
        from: defaultMinDate,
        to: defaultMaxDate
    }

    const [FilterOptions, setFilterOptions] = useState(FilterOptionsDefaultState)

    const fromMinDate = defaultMinDate
    const fromMaxDate = moment(FilterOptions.to).isValid() ? FilterOptions.to : defaultMaxDate

    const toMinDate = moment(FilterOptions.from).isValid() ? FilterOptions.from : defaultMinDate
    const toMaxDate = defaultMaxDate

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of logs)
        take: 15,//Logs per page
    })

    const eventOptions = [
        "FUND_CREATION",
        "FUND_UPDATE",
        "FUND_DELETE",
        "ADMIN_APPROVE",
        "ADMIN_DENY",
        "ADMIN_LIQUIDATE",
        "CLIENT_APPROVE",
        "CLIENT_DENY",
        "MOVEMENT_GENERATE",
        "BROADCAST",
        "DEPOSIT_CLOSE",
        "DEPOSIT_UPDATE"
    ].map(eventOption => ({ label: t(eventOption), value: eventOption }))

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

    const getEvents = (signal) => {
        setEvents((prevState) => (
            {
                ...prevState,
                status: "loading",
                content: { events: [], total: 0 }
            }))
        axios.get(`/events`,
            {
                params: {
                    skip: Pagination.skip, take: Pagination.take,
                    onlyAdmin: FilterOptions?.client?.value === "admin",
                    client:
                        FilterOptions?.client === "" || FilterOptions?.client?.value === "admin"
                            ? null
                            : FilterOptions?.client?.value,
                    filterType: FilterOptions?.type === ""
                        ? null
                        : FilterOptions?.type?.value,
                    startDate: FilterOptions.from,
                    endDate: moment(FilterOptions.to).add(1, "day").format(moment.HTML5_FMT.DATE)
                }, signal: signal
            })
            .then(function (response) {
                setEvents((prevState) => (
                    {
                        ...prevState,
                        status: "succeeded",
                        content: response?.data
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") toLogin()
                    else {
                        setEvents((prevState) => (
                            {
                                ...prevState,
                                status: "error",
                                content: { events: [], total: 0 }
                            }))

                    }
                }
            })
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;



        getEvents(signal)
        return () => {
            controller.abort();
        };
        // eslint-disable-next-line
    }, [Pagination.skip])

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            setPagination(prevState => ({ ...prevState, skip: 0 }))
            getEvents()
        } else {
            setValidated(true)
        }
    }

    const [Users, setUsers] = useState({ status: "idle", content: [] })

    const selectUserById = (userId) => Users.content.find(user => user.id === userId)

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setUsers((prevState) => (
            {
                ...prevState,
                status: "loading",
                content: []
            }))
        axios.get(`/users`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setUsers((prevState) => (
                {
                    ...prevState,
                    status: "succeeded",
                    content: response?.data
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                else {
                    setUsers((prevState) => (
                        {
                            ...prevState,
                            status: "error",
                            content: []
                        }))

                }
            }
        })

        return () => {
            controller.abort();
        };

        // eslint-disable-next-line
    }, [])

    const [Accounts, setAccounts] = useState({ status: "idle", content: [] })

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setAccounts((prevState) => (
            {
                ...prevState,
                status: "loading",
                content: []
            }))
        axios.get(`/accounts`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setAccounts((prevState) => (
                {
                    ...prevState,
                    status: "succeeded",
                    content: response?.data
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                else {
                    setAccounts((prevState) => (
                        {
                            ...prevState,
                            status: "error",
                            content: []
                        }))

                }
            }
        })

        return () => {
            controller.abort();
        };

        // eslint-disable-next-line
    }, [])

    const [Clients, setClients] = useState({ status: "idle", content: [] })

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setClients((prevState) => (
            {
                ...prevState,
                status: "loading",
                content: []
            }))
        axios.get(`/clients`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setClients((prevState) => (
                {
                    ...prevState,
                    status: "succeeded",
                    content: response?.data
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                else {
                    setClients((prevState) => (
                        {
                            ...prevState,
                            status: "error",
                            content: []
                        }))

                }
            }
        })

        return () => {
            controller.abort();
        };

        // eslint-disable-next-line
    }, [])

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

    const ContextAwareToggle = ({ children, eventKey, callback }) => {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <div
                className="header d-flex  mb-0">
                <h1 className="title">{children}</h1>
                <Button
                    className="ms-auto"
                    style={{ backgroundColor: isCurrentEventKey ? 'purple' : '', alignSelf: "center" }}
                    onClick={decoratedOnClick}
                    type="button"><FontAwesomeIcon icon={faSlidersH} /></Button>
            </div>

        );
    }

    const options = [{ label: t("Administrators"), value: "admin" }, ...Clients.content
        .map(client =>
            ({ label: client.alias, value: client.id }))]

    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                {Users.status === "loading" || Accounts.status === "loading" || Clients.status === "loading" ?
                    <Loading />
                    :
                    <Col className="section growOpacity h-100 d-flex flex-column">
                        <Accordion style={{ borderBottom: "1px solid #b3b3b3" }} >
                            <ContextAwareToggle eventKey="0">{t("User action logs")}</ContextAwareToggle>
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
                                            <Form.Label>{t("Log type")}</Form.Label>
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
                                                options={eventOptions}
                                                value={FilterOptions.type}
                                                classNames={{
                                                    input: () => "react-select-input",
                                                }}
                                                isClearable
                                            />
                                        </Col>
                                        <div className="w-100 m-0"></div>
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
                            Events.status === "loading" ?
                                <Loading className="h-100 mb-5" />
                                :
                                Events?.content?.events?.length === 0 ?
                                    <EmptyTable className="h-100 mb-5" />
                                    :
                                    <div className="py-3 w-100">
                                        <div className="w-100 overflow-auto">
                                            <Table className="ClientsTable mb-0" striped bordered hover>
                                                <thead className="verticalTop tableHeader solid-bg">
                                                    <tr>
                                                        <th className="id">{t("Date")}</th>
                                                        <th className="Alias">{t("User email")}</th>
                                                        <th className="Alias">{t("User name")}</th>
                                                        <th className="Balance">{t("Action")}</th>
                                                        <th className="Balance">{t("Detail")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        Events.content.events.map(
                                                            Log => <UserActionLog Funds={Funds.content} key={`user-log-${Log.id}`} User={selectUserById(Log.userId)} Log={Log} Users={Users.content} Accounts={Accounts.content} Clients={Clients.content} />
                                                        )
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                        <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Events?.content?.total} />
                                    </div>

                        }

                    </Col>
                }
            </Row>
        </Container >

    );
}

export default UserActionLogs