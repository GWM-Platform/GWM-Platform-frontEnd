import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, FloatingLabel, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { urlContext } from '../../context/urlContext';
import './index.css'
const ContainerVerifyAccount = () => {
    const {urlPrefix} = useContext(urlContext)
    const { t } = useTranslation();
    const { user, token } = useParams();

    const [formData, setFormData] = useState({})
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
            verifyAccount(formData)
        }
        setValidated(true);
    }

    const verifyAccount = () => {
        setButtonDisabled(true)
        var url = `${urlPrefix}/users/verify/?` + new URLSearchParams({
            token: formData.token,
        });
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: "*/*",
            }
        }).then(res => res.json())
            .then(response => {
                console.log('Success:', response)
                setButtonDisabled(false)
            }).catch(error => {
                console.error('Error:', error)
                setButtonDisabled(false)
            })
    }

    return (
        <Container fluid px-0 className="verifyAccount ">
            <Row className="min-100vh d-flex justify-content-center align-items-center">
                <Col sm="12" md="10" lg="6" xl="5">
                    <Card className="px-2 pb-4">
                        <Card.Body>
                            <h1 className="pb-2">{t("Verify Account")}</h1>
                            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                                <FloatingLabel
                                    label={t("Token")}
                                    className="mb-3"
                                >
                                    <Form.Control
                                        required
                                        defaultValue={token}
                                        type="text"
                                        placeholder={t("Token")}
                                        id="token"
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                                <FloatingLabel
                                    label={t("username")}
                                    className="mb-3"
                                >
                                    <Form.Control
                                        defaultValue={user}
                                        type="text"
                                        placeholder={t("username")}
                                        id="username"
                                        onChange={handleChange}

                                    />
                                </FloatingLabel>
                                <FloatingLabel
                                    label={t("name")}
                                    className="mb-3 capitalize"
                                >
                                    <Form.Control
                                        className="capitalize"
                                        defaultValue={user}
                                        type="text"
                                        placeholder={t("name")}
                                        id="name"
                                        onChange={handleChange}

                                    />
                                </FloatingLabel>
                                <FloatingLabel
                                    label={t("surname")}
                                    className="mb-3 capitalize"
                                >
                                    <Form.Control
                                        id="surname"
                                        className="capitalize"
                                        defaultValue={user}
                                        type="text"
                                        placeholder={t("surname")}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>

                                <FloatingLabel
                                    id="password"
                                    label={t("Password")}
                                    className="mb-3"
                                >
                                    <Form.Control
                                        type="password"
                                        placeholder={t("Password")}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                                <FloatingLabel
                                    id="confirmPassword"
                                    label={t("Confirm password")}
                                    className="mb-3"
                                >
                                    <Form.Control
                                        type="password"
                                        placeholder={t("Token")}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                                <Row className="d-flex justify-content-end">
                                    <Col xs="auto">
                                        <Button className="button" variant="danger" type="submit" disabled={buttonDisabled}>{t("Submit")}</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
export default ContainerVerifyAccount
