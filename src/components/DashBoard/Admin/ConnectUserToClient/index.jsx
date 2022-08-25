import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Loading from "../Loading";
import Error from "components/DashBoard/Admin/Error";
import { useTranslation } from "react-i18next";
import BaseSelect from "react-select";
import FixRequiredSelect from "components/DashBoard/GeneralUse/Forms/FixRequiredSelect";

const ConnectUserToClient = () => {
    const { toLogin } = useContext(DashBoardContext)
    const { t } = useTranslation()

    const [clients, setClients] = useState({ fetching: true, fetched: false, valid: false, content: [] })
    const [users, setUsers] = useState({ fetching: true, fetched: false, valid: false, content: [] })
    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })

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

    const connectUserToClient = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/clients/${data.client.value}/connect`, undefined, { params: { userId: data.user.value } },
        ).then(function (response) {
            setRequest((prevState) => (
                {
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }

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

    const [data, setData] = useState(
        {
            client: "",
            user: "",
        }
    )
    const [validated, setValidated] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            connectUserToClient()
        }
        setValidated(true);
    }

    const Select = props => (
        <FixRequiredSelect
            {...props}
            SelectComponent={BaseSelect}
            options={props.options}
        />
    );

    return (
        showLoading() ?
            <Loading />
            :
            error() ?
                <Error />
                :
                <Container>
                    <Row>
                        <Col xs="12">
                            <div className="growOpacity">
                                <h1>{t("Connect user to client")}</h1>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Label>{t("Select the client to witch you want to connect the user")}</Form.Label>
                                    <Select className="mb-3" required value={data.client} placeholder={false} noOptionsMessage={() => t('No clients found')}
                                        onChange={(val) => {
                                            setData(prevState => ({ ...prevState, client: val }));
                                            setRequest(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                                        }}
                                        options={clients.content.map((client, key) => (
                                            {
                                                label: `${t("Number")}: ${client.id} / ${t("Alias")}: ${client.alias} / ${t("Name")}: ${client.firstName} ${t("Apellido")}: ${client.lastName}`,
                                                value: client.id
                                            }
                                        ))}
                                    />
                                    <Form.Label>{t("Select the user you want to connect to the selected client")}</Form.Label>
                                    <Select className="mb-3" required value={data.user} placeholder={false} noOptionsMessage={() => t('No users found')}
                                        onChange={(val) => {
                                            setData(prevState => ({ ...prevState, user: val }));
                                            setRequest(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                                        }}
                                        options={users.content.map((user, key) => (
                                            {
                                                label: `${t("Number")}: ${user.id} / ${t("Email")}: ${user.email}`,
                                                value: user.id
                                            }
                                        ))}
                                    />
                                    {
                                        Request.fetched &&
                                        <div className="w-100 mb-2">
                                            <Form.Text className={!Request.valid ? "text-danger" : "text-success"}>
                                                {
                                                    Request.valid ?
                                                        t("User connected to the client selected successfully")
                                                        :
                                                        t("The user could not be connected to the client")
                                                }
                                            </Form.Text>
                                        </div>
                                    }

                                    <Button variant="danger" type="submit" disabled={Request.fetching}>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            style={{ display: Request.fetching ? "inline-block" : "none" }}
                                        />{' '}
                                        {t("Submit")}</Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
    );
}

export default ConnectUserToClient