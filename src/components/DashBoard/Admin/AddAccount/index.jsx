import React, { useCallback, useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import BaseSelect from "react-select";
import FixRequiredSelect from 'components/DashBoard/GeneralUse/Forms/FixRequiredSelect';

const AddAccount = () => {
    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation();

    const [formData, setFormData] = useState(
        {
            email: "",
            firstName: "",
            lastName: "",
            type: "",
            client: {}
        }
    )

    const [message, setMessage] = useState()

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
            signup(formData)
        }
        setValidated(true);
    }

    const signup = async () => {
        setButtonDisabled(true)
        axios.post(`/clients/signup`,
            formData.type === "1" ? {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            } :
                {
                    email: formData.email,
                    clientId: formData.client.value
                }
        ).then(function (response) {
            setMessage("La cuenta ha sido creada con exito, se enviara un link de verificacion al mail especificado")
            setButtonDisabled(false)
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                if (err.response.status === "501") {
                    setMessage("Server error")
                }else{
                    setMessage("Error. Verify the data entered")
                }
            }
        });
    }

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


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getClients(signal)

        return () => {
            controller.abort();
        };
    }, [getClients])


    const Select = props => (
        <FixRequiredSelect
            {...props}
            SelectComponent={BaseSelect}
            options={props.options}
        />
    );


    const clientSelectedValid = () => formData?.client.value

    return (
        <Container className="h-100">
            <Row className="h-100 d-flex justify-content-center">
                <Col>
                    <h1 className="pb-2">{t("Add account")}</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("Email")}</Form.Label>
                            <Form.Control
                                onChange={handleChange}
                                type="email"
                                placeholder={t("Email")}
                                required
                                id="email"
                                value={formData.email}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("Connect the new user to a")}</Form.Label>
                            <Form.Select required onChange={handleChange} value={formData.type} id="type" aria-label="Select type">
                                <option value="" disabled>{t("Open this select menu")}</option>
                                <option value="1" >{t("New client")}</option>
                                <option value="2" >{t("Existing client")}</option>
                            </Form.Select>
                        </Form.Group>

                        {
                            formData.type === "1" ?
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t("First Name")}</Form.Label>
                                        <Form.Control
                                            value={formData.firstName}
                                            required
                                            id="firstName"
                                            onChange={handleChange}
                                            type="text"
                                            placeholder={t("First Name")}
                                        />
                                    </Form.Group>


                                    <Form.Group className="mb-3">
                                        <Form.Label>{t("Last Name")}</Form.Label>
                                        <Form.Control
                                            value={formData.lastName}
                                            required
                                            id="lastName"
                                            onChange={handleChange}
                                            type="text"
                                            placeholder={t("Last Name")}
                                        />
                                    </Form.Group>
                                </>
                                :
                                !!(true) &&
                                <Form.Group className="mb-3">
                                    <Form.Label>{t("Select the client to witch you want to connect the user")}</Form.Label>
                                    <Select
                                        valid={validated ? clientSelectedValid() : false}
                                        invalid={validated ? !clientSelectedValid() : false}

                                        className="mb-3" required value={formData.client} placeholder={false} noOptionsMessage={() => t('No clients found')}
                                        onChange={(val) => {
                                            setFormData(prevState => ({ ...prevState, client: val }));
                                        }}
                                        options={clients.content.map((client, key) => (
                                            {
                                                label: `${t("Number")}: ${client.id} / ${t("Alias")}: ${client.alias} / ${t("Name")}: ${client.firstName} ${t("Apellido")}: ${client.lastName}`,
                                                value: client.id
                                            }
                                        ))}
                                    />
                                </Form.Group>
                        }

                        <p>{message}</p>
                        <Button disabled={buttonDisabled} variant="danger" type="submit">{t("Submit")}</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default AddAccount


