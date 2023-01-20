
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Accordion, AccordionContext, Button, Col, Container, Form, Row, Table, useAccordionButton } from "react-bootstrap";
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from "context/DashBoardContext";
import UserActionLog from "./UserActionLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import EmptyTable from "components/DashBoard/GeneralUse/EmptyTable";
import PaginationController from "components/DashBoard/GeneralUse/PaginationController";

const UserActionLogs = () => {

    const { t } = useTranslation();

    const { toLogin } = useContext(DashBoardContext)

    const [Events, setEvents] = useState({ status: "idle", content: { events: [], total: 0 } })

    const [FilterOptions, setFilterOptions] = useState({ client: "", type: "" })
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
        "BROADCAST"
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

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

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
        return () => {
            controller.abort();
        };
        // eslint-disable-next-line
    }, [FilterOptions.client, FilterOptions.type,Pagination.skip])

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
                    style={{ backgroundColor: isCurrentEventKey ? 'purple' : '' }}
                    onClick={decoratedOnClick}
                    type="button"><FontAwesomeIcon icon={faFilter} /></Button>
            </div>

        );
    }

    const options = [{ label: t("Administration"), value: "admin" }, ...Clients.content
        .map(client =>
            ({ label: client.alias, value: client.id }))]

    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                {Users.status === "loading" || Accounts.status === "loading" || Clients.status === "loading" ?
                    <Loading />
                    :
                    <Col className="section growOpacity h-100 d-flex flex-column">
                        <Accordion >
                            <ContextAwareToggle eventKey="0">{t("User action logs")}</ContextAwareToggle>
                            <Accordion.Collapse eventKey="0">
                                <Row className="pt-3">
                                    <Col md="6">
                                        <Form.Label>{t("Client / Administration")}</Form.Label>
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
                                            required
                                            value={FilterOptions.client}
                                            classNames={{
                                                input: () => "react-select-input",
                                            }}
                                            isClearable
                                        />
                                    </Col>
                                    <Col md="6">
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
                                            required
                                            value={FilterOptions.type}
                                            classNames={{
                                                input: () => "react-select-input",
                                            }}
                                            isClearable
                                        />
                                    </Col>

                                </Row>
                            </Accordion.Collapse>
                        </Accordion>
                        {
                            Events.status === "loading" ?
                                <Loading className="h-100 mb-5" />
                                :
                                Events?.content?.events?.length === 0 ?
                                    <EmptyTable className="h-100 mb-5" />
                                    :
                                    <div className="py-3">
                                        <Table className="ClientsTable" striped bordered hover>
                                            <thead className="verticalTop tableHeader solid-bg">
                                                <tr>
                                                    <th className="id">{t("Log")} #</th>
                                                    <th className="id">{t("Date")}</th>
                                                    <th className="Alias">{t("User email")}</th>
                                                    <th className="Balance">{t("Action")}</th>
                                                    <th className="Balance">{t("Detail")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    Events.content.events.map(
                                                        Log => <UserActionLog key={`user-log-${Log.id}`} User={selectUserById(Log.userId)} Log={Log} Users={Users.content} Accounts={Accounts.content} Clients={Clients.content} />
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                        <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Events?.content?.total} />
                                    </div>

                        }

                    </Col>
                }
            </Row>
        </Container>

    );
}

export default UserActionLogs