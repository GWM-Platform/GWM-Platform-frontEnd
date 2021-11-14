import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { urlContext } from '../../../../context/urlContext';

const AddAccount = () => {
    const { urlPrefix } = useContext(urlContext)

    const { t } = useTranslation();
    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState()

    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const handleChange = (event) => {
        let aux = formData;
        aux[event.target.id] = event.target.value;
        setFormData(aux);
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
        var url = `${urlPrefix}/clients/signup`;

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            setMessage("La cuenta ha sido creada con exito, se enviara un link de verificacion al mail especificado")
            setButtonDisabled(false)
        } else {
            switch (response.status) {
                case 500:
                    setMessage("Error. Vefique los datos ingresados")
                    break;
                default:
                    console.error(response.status)
                    setMessage("unhandled Error")
            }
            setButtonDisabled(false)
        }
    }

    return (
        <Container className="notFound">
            <Row className="min-free-area d-flex justify-content-center">
                <Col sm="12" md="9">
                    <h1 className="pb-2">{t("Add Account")}</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <FloatingLabel
                            label={t("Email")}
                            className="mb-3"
                        >
                            <Form.Control
                                onChange={handleChange}
                                type="email"
                                placeholder={t("Email")}
                                required
                                id="email"
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            label={t("First Name")}
                            className="mb-3"
                        >
                            <Form.Control
                                required
                                id="firstName"
                                onChange={handleChange}
                                type="text"
                                placeholder={t("First Name")}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            label={t("Last Name")}
                            className="mb-3"
                        >
                            <Form.Control
                                required
                                id="lastName"
                                onChange={handleChange}
                                type="text"
                                placeholder={t("Last Name")}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            label={t("Password")}
                            className="mb-3"
                        >
                            <Form.Control
                                required
                                id="password"
                                onChange={handleChange}
                                type="Password"
                                placeholder={t("Password")}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            label={t("username")}
                            className="mb-3"
                        >
                            <Form.Control
                                disabled
                                id="username"
                                onChange={handleChange}
                                type="text"
                                placeholder={t("username")}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            id="initialFounds"
                            label={t("Initial Founds")}
                            className="mb-3"
                        >
                            <Form.Control
                                disabled
                                onChange={handleChange}
                                type="number"
                                min="0"
                                placeholder={t("Initial Founds")}
                            />
                        </FloatingLabel>
                        <p>{message}</p>
                        <Button disabled={buttonDisabled} variant="danger" type="submit">{t("Submit")}</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default AddAccount

