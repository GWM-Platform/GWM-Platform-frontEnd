import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Accordion, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import UserItem from "./UserItem";
import './index.scss'

const ClientUsersAccordion = ({ client }) => {
    const { t } = useTranslation()

    const { toLogin } = useContext(DashBoardContext)

    const [users, setUsers] = useState({ fetching: false, fetched: false, valid: false, content: [] })

    const getUsers = useCallback((signal) => {
        setUsers((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/users`, {
            params: { clientId: client.id },
            signal: signal,
        }).then(function (response) {
            setUsers((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data.sort((user) => user.isOwner ? -1 : 0),
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setUsers((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setUsers, client]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getUsers(signal)

        return () => {
            controller.abort();
        };
    }, [getUsers])


    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{t("Users connected to the client")}</Accordion.Header>
                <Accordion.Body className="usersList">
                    {users.content.map(user => <UserItem getUsers={getUsers} user={user} client={client} key={`user-item-${client.id}-${user.id}`} />)}
                    <div className="mt-2 d-flex justify-content-end">
                        <Link to={`/DashBoard/clientsSupervision/${client.id}/connectUserToClient`}>
                            <Button>{t("Connect a new user")}</Button>
                        </Link>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default ClientUsersAccordion