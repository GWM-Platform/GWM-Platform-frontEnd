
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from "context/DashBoardContext";
import UserActionLog from "./UserActionLog";

const UserActionLogs = () => {

    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext)

    const [Events, setEvents] = useState({ status: "idle", content: { events: [], total: 0 } })

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setEvents((prevState) => (
            {
                ...prevState,
                status: "loading",
                content: { events: [], total: 0 }
            }))
        axios.get(`/events`, { params: { skip: 0, take: 50 }, signal: signal })
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
    }, [])

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

    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                {Events.status === "loading" || Users.status === "loading" || Accounts.status === "loading" || Clients.status === "loading" ?
                    <Loading />
                    :
                    <Col className="section growOpacity">
                        <div className="header">
                            <h1 className="title">{t("User action logs")}</h1>
                        </div>
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
                    </Col>
                }
            </Row>
        </Container>

    );
}

export default UserActionLogs