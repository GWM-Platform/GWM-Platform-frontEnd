import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { passwordStrength } from 'check-password-strength'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'

import './index.css'

const SetPassword = () => {
    const { t } = useTranslation();
    const [Data, setData] = useState({
        password: "",
        passwordConfirm: ""
    })
    const [validation, setValidation] = useState(passwordStrength(''))

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if ((validation.value === "Medium" || validation.value === "Strong") && Data.password === Data.passwordConfirm) {
            alert("mandar request")

        }
    };

    const handleChange = (event) => {
        let aux = Data
        aux[event.target.id] = event.target.value
        setData({ ...Data, ...aux })
        if (event.target.id === "password") {
            setValidation(passwordStrength(event.target.value))
        }
    }
    return (

        <Container className="setPassword growOpacity">
            <Row className="justify-content-center d-flex">
                <Col xs="8">
                    <Card className="Card">
                        <Card.Body>
                            <h1>{t("Welcome!")}</h1>
                            <h2>{t("You are about to start investing with GWM")}</h2>
                            <h3>{t("But first you will have to set a new password")}</h3>

                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="mb-4">
                                    <Col xs="12">
                                        <Form.Group>
                                            <Form.Label>{t("New Password")}</Form.Label>
                                            <Form.Control
                                                id="password"
                                                placeholder={t("New Password")}
                                                type="password"
                                                value={Data.password}
                                                onChange={handleChange}
                                                isValid={validation.value === "Medium" || validation.value === "Strong"}
                                                isInvalid={validation.value !== "Medium" && validation.value !== "Strong"}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                <p className="validation">{t("Your new password must have")}:
                                                    <br />
                                                    <span className={`pe-1 ${validation.length > 8 ? "textGreen" : "textRed"}`}>
                                                        <FontAwesomeIcon icon={validation.length > 8 ? faCheckCircle : faTimesCircle} />
                                                        {" "}
                                                        {t("8 characters lenght")}
                                                    </span>
                                                    <br />
                                                    <span className={`pe-1 ${validation.contains.includes('number') ? "textGreen" : "textRed"}`}>
                                                        <FontAwesomeIcon icon={validation.contains.includes('number') ? faCheckCircle : faTimesCircle} />
                                                        {" "}
                                                        {t("A number")}
                                                    </span>
                                                    <br />
                                                    <span className={`pe-1 ${validation.contains.includes('lowercase') ? "textGreen" : "textRed"}`}>
                                                        <FontAwesomeIcon icon={validation.contains.includes('lowercase') ? faCheckCircle : faTimesCircle} />
                                                        {" "}
                                                        {t("A lowercase letter")}
                                                    </span>
                                                    <br />
                                                    <span className={`pe-1 ${validation.contains.includes('uppercase') ? "textGreen" : "textRed"}`}>
                                                        <FontAwesomeIcon icon={validation.contains.includes('uppercase') ? faCheckCircle : faTimesCircle} />
                                                        {" "}
                                                        {t("A capital letter")}
                                                    </span>
                                                    <br />
                                                    <span className={`pe-1 ${validation.contains.includes('symbol') ? "textGreen" : "textRed"}`}>
                                                        <FontAwesomeIcon icon={validation.contains.includes('symbol') ? faCheckCircle : faTimesCircle} />
                                                        {" "}
                                                        {t("A symbol")}
                                                    </span>
                                                </p>
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>{t("Password Confirmation")}</Form.Label>
                                            <Form.Control
                                                id="passwordConfirm"
                                                type="password"
                                                placeholder={t("Password Confirmation")}
                                                value={Data.passwordConfirm}
                                                onChange={handleChange}
                                                isInvalid={Data.password !== Data.passwordConfirm || (validation.value !== "Medium" && validation.value !== "Strong")}
                                                isValid={Data.password === Data.passwordConfirm}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                {
                                                    Data.password !== Data.passwordConfirm ?
                                                        t("Password and password cofirmation must match")
                                                        :
                                                        t("Make sure the password meets the requirements")
                                                }
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs="12">
                                        <Button variant="danger" type="submit" className='mainColor mt-4'>
                                            {t("Confirm Password")}
                                        </Button>
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

export default SetPassword