
import axios from "axios";
import React, { useCallback, useContext, useEffect } from "react";
import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { DashBoardContext } from "context/DashBoardContext";
import { OperationsTable } from "./OperationsTable";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import CreateForm from "./CreateForm";
import { useTranslation } from "react-i18next";

const Operations = () => {
    const { t } = useTranslation()
    const { toLogin } = useContext(DashBoardContext)

    const [Users, setUsers] = useState({ status: "idle", content: [] })
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
    const eventOptions = useCallback((includeNotCreatables = false) => [
        "LIQUIDATE_FUND",
        ...includeNotCreatables ? [
            "CREATE_ADMIN",
            "ASSIGN_ADMIN",
            "REMOVE_ADMIN"
        ] : []
    ].map(eventOption => ({ label: t(eventOption), value: eventOption })), [t])

    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                <Switch>
                    <Route exact path="/DashBoard/operations/creation">
                        <CreateForm eventOptions={eventOptions()} />
                    </Route>
                    <Route path="*">
                        <OperationsTable eventOptions={eventOptions(true)} Users={Users} Accounts={Accounts} Clients={Clients} />
                    </Route>
                </Switch>
            </Row>
        </Container >

    );
}

export default Operations

