import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const AddAccount = () => {

    const { t } = useTranslation();
    const [formData, setFormData] = useState(
        {
            email: "",
            firstName: "",
            lastName: ""
        }
    )
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
        var url = `${process.env.REACT_APP_APIURL}/clients/signup`;
        const token = sessionStorage.getItem('access_token')

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                Authorization: `Bearer ${token}`,
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
        <Container className="h-100">
            <Row className="h-100 d-flex justify-content-center">
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
                        <p>{message}</p>
                        <Button disabled={buttonDisabled} variant="danger" type="submit">{t("Submit")}</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default AddAccount


