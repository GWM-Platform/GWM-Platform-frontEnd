import React, { useCallback, useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import Multiselect from 'multiselect-react-dropdown';
import { useRef } from 'react';

const Broadcast = () => {
    const receiversSelectorRef = useRef(null);

    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation();

    const [formData, setFormData] = useState(
        {
            title: "",
            emailBody: "",
            receivers: []
        }
    )

    const [message, setMessage] = useState()

    const [users, setUsers] = useState({ fetching: true, fetched: false, valid: false, content: [] })
    const [clients, setClients] = useState({ fetching: true, fetched: false, valid: false, content: [] })

    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const handleChange = (event) => {
        setFormData(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            broadcast()
        }
        setValidated(true);
    }

    const broadcast = async () => {

        setButtonDisabled(true)
        const formDataSubmit = new FormData()

        const files = filesInput.current.files

        for (var i = 0; i < files.length; i++) {
            formDataSubmit.append("files", files[i])
        }

        let receivers = formData.receivers.filter(receiver => !receiver.selectAll).map(receiver => receiver.email)
        for (var j = 0; j < receivers.length; j++) {
            formDataSubmit.append("receivers", receivers[j])
        }

        formDataSubmit.append("title", formData.title)
        formDataSubmit.append("emailBody", formData.emailBody)

        axios.post(`/users/broadcast`, formDataSubmit)
            .then(function (response) {
                setMessage("The broadcast was successfully sent")
                setButtonDisabled(false)
            })
            .catch((err) => {
                if (err.message !== "canceled") {
                    setButtonDisabled(false)
                    if (err.response.status === 401) toLogin()
                    console.log(err.response.status)
                    if (err.response.status === 500) {
                        setMessage("Server error. Try it again later")
                    } else {
                        setMessage("Error. Verify the entered data")
                    }
                }
            });
    }

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
        getUsers(signal)

        return () => {
            controller.abort();
        };
    }, [getUsers])

    const getClients = useCallback((signal) => {
        setClients((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/clients`, {
            params: { all: true, showUsers: true },
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

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getClients(signal)

        return () => {
            controller.abort();
        };
    }, [getClients])

    useEffect(() => {
        setButtonDisabled(formData?.receivers.length === 0)
        if (formData?.receivers?.length === users?.content?.length && formData?.receivers?.length !== 0 && users?.content?.length !== 0) {
            setFormData(prevState => (
                {
                    ...prevState,
                    receivers: [...prevState.receivers, { key: t("All users"), selectAll: true }]
                }
            ))
        }
        // eslint-disable-next-line
    }, [formData?.receivers, users?.content?.length])

    const allUsersSelected = () => formData?.receivers.length > users?.content?.length

    const filesInput = useRef(null)

    const groupedClients = () => {
        var aux = []

        if (clients.fetched && users.fetched) {
            for (let client of clients.content) {
                aux = [
                    ...aux,
                    ...client.users.map(
                        userToClient => ({ ...userToClient?.user, clientAlias: client?.alias, key: userToClient?.user?.email })
                    )
                ]
            }
        }
        return aux
    }

    console.log(groupedClients())

    return (
        <Container className="h-100">
            <Row className="h-100 d-flex justify-content-center">
                <Col className="growOpacity section">
                    <div className="header">
                        <h1 className="title">{t("Broadcast to users")}</h1>
                    </div>
                    <style>
                        {`
                        .chip:not(:first-of-type){
                            display:${allUsersSelected() ? "none" : "inline-flex"}
                        }
                        `}
                    </style>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Recipients")}</Form.Label>
                            <Multiselect
                                className="flex-grow"
                                disable={!users.fetched}
                                isObject={true}
                                placeholder=""
                                groupBy='clientAlias'
                                emptyRecordMsg={t(users.content.length > 0 ? "There are no more users available to add to the broadcast" : "There are no users available to add to the broadcast")}
                                showCheckbox
                                //hideSelectedList
                                displayValue="key"
                                selectedValues={formData.receivers}
                                onKeyPressFn={function noRefCheck() { }}
                                onSearch={function noRefCheck() { }}
                                onSelect={
                                    //eslint-disable-next-line
                                    (a, selectedItem) => {
                                        setFormData(prevState => (
                                            {
                                                ...prevState,
                                                receivers:
                                                    selectedItem.selectAll ?
                                                        [{ key: t("All users"), selectAll: true }, ...users.content.map(user => ({ ...user, key: user.email }))]
                                                        :
                                                        [...prevState.receivers, selectedItem].length === users.content.length ? [{ key: t("All users"), selectAll: true }, ...prevState.receivers, selectedItem].sort((user) => user.key === t("All users") ? -1 : 0) : [...prevState.receivers, selectedItem]
                                            }
                                        ))
                                    }
                                }
                                onRemove={
                                    //eslint-disable-next-line
                                    (a, removedItem) => {
                                        setFormData(prevState => {

                                            let receivers = [...removedItem?.selectAll ? [] : prevState.receivers]
                                            if (!removedItem?.selectAll) {
                                                const index = receivers.findIndex(receiver => receiver.email === removedItem.email)
                                                if (index > -1) {
                                                    receivers.splice(index, 1); // 2nd parameter means remove one item only
                                                }
                                                const indexSelectAll = receivers.findIndex(receiver => receiver.selectAll)
                                                if (indexSelectAll > -1) {
                                                    receivers.splice(indexSelectAll, 1); // 2nd parameter means remove one item only
                                                }
                                            }

                                            return (
                                                {
                                                    ...prevState,
                                                    receivers: receivers
                                                }
                                            )
                                        })
                                    }
                                }
                                ref={receiversSelectorRef}
                                options={[{ key: t("All users"), selectAll: true }, ...groupedClients()]}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId='title'>
                            <Form.Label>{t("Email title")}</Form.Label>
                            <Form.Control
                                onChange={handleChange} value={formData.title} className="mb-1" required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId='emailBody'>
                            <Form.Label>{t("Email body")}</Form.Label>
                            <Form.Control as="textarea" maxLength="100"
                                onChange={handleChange} value={formData.emailBody} className="mb-1" style={{ height: "100px" }} required
                            />
                        </Form.Group>

                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>{t("Attached files")}</Form.Label>
                            <Form.Control ref={filesInput} type="file" multiple />
                        </Form.Group>

                        <p>{t(message)}</p>
                        <Button className="mb-3" disabled={buttonDisabled} variant="danger" type="submit" >{t("Submit")}</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default Broadcast