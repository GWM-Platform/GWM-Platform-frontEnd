import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Loading from "../Loading";
import Error from "components/DashBoard/Admin/Error";
import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
import ClientsTable from "./ClientsTable";
import ConnectForm from "./ConnectForm";

const ConnectUserToClient = () => {
    const { toLogin } = useContext(DashBoardContext)
    const { t } = useTranslation()

    const [clients, setClients] = useState({ fetching: true, fetched: false, valid: false, content: [] })
    const [users, setUsers] = useState({ fetching: true, fetched: false, valid: false, content: [] })

    const getClients = useCallback((signal) => {
        setClients((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/clients`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setClients((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setClients((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setClients]);

    const getUsers = useCallback((signal) => {
        setUsers((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/users`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setUsers((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setUsers((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setUsers]);

    

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getClients(signal)

        return () => {
            controller.abort();
        };
    }, [getClients])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getUsers(signal)

        return () => {
            controller.abort();
        };
    }, [getUsers])

    const showLoading = () => clients.fetching || users.fetching
    const error = () => !(clients.valid /*&& users.valid */)

   

    
    return (
        showLoading() ?
            <Loading />
            :
            error() ?
                <Error />
                :
                <Switch>
                    <Route exact path="/DashBoard/connectUserToClient/">
                        <ClientsTable clients={clients} />
                    </Route>
                    {clients.content.map((client) =>
                        <Route exact path={`/DashBoard/connectUserToClient/${client.id}`}>
                            <ConnectForm client={client} users={users}/>
                        </Route>

                    )}
                    <Route path="*">
                        <h1>{t("Not found")}</h1>
                    </Route>
                </Switch>

    );
}

export default ConnectUserToClient