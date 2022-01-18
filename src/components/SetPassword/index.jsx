import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { passwordStrength } from 'check-password-strength'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';
import './index.css'

const SetPassword = () => {
    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const toDashboard = () => {
        history.push(`/dashboard/accounts`);
    }

    const history = useHistory();

    const token = sessionStorage.getItem('access_token')
    if (token === null) toLogin()

    const { t } = useTranslation();

    const [Data, setData] = useState({
        password: "",
        passwordConfirm: "",
        passwordChanged: false
    })

    const [validation, setValidation] = useState(passwordStrength(''))


    const changePassword = async () => {
        var url = `${process.env.REACT_APP_APIURL}/users/setInitialPassword`;

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ password: Data.password }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            setData({ ...Data, ...{ passwordChanged: true } })
        } else {
            switch (response.status) {
                case 500:
                    break;
                default:
                    console.log(response.status)
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if ((validation.value === "Medium" || validation.value === "Strong") && Data.password === Data.passwordConfirm) {
            changePassword()
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
                        <Card.Body className="growOpacity" >
                            {Data.passwordChanged ?
                                <div className="result growOpacity">
                                    <h1 className="icon" >
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                    </h1>
                                    <h2 className="label">
                                        {t("Password, has been changed successfully.")}
                                    </h2>
                                    <Col xs="12" className="d-flex justify-content-center">
                                        <Button variant="danger" onClick={() => toDashboard()} className='btn mainColor mt-4'>
                                            {t("To dashboard")}
                                        </Button>
                                    </Col>
                                </div>
                                :
                                <div className="growOpacity">

                                    <h1>{t("Welcome!")}</h1>
                                    <h2>{t("You are about to start investing with GWM")}</h2>
                                    <h3>{t("But first you will have to set a new password")}</h3>

                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Row className="mb-2">
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
                                                    <Form.Control.Feedback>{t("Looks good")}!</Form.Control.Feedback>
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
                                                                {t("a number")}
                                                            </span>
                                                            <br />
                                                            <span className={`pe-1 ${validation.contains.includes('lowercase') ? "textGreen" : "textRed"}`}>
                                                                <FontAwesomeIcon icon={validation.contains.includes('lowercase') ? faCheckCircle : faTimesCircle} />
                                                                {" "}
                                                                {t("a lowercase letter")}
                                                            </span>
                                                            <br />
                                                            <span className={`pe-1 ${validation.contains.includes('uppercase') ? "textGreen" : "textRed"}`}>
                                                                <FontAwesomeIcon icon={validation.contains.includes('uppercase') ? faCheckCircle : faTimesCircle} />
                                                                {" "}
                                                                {t("a capital letter")}
                                                            </span>
                                                            <br />
                                                            <span className={`pe-1 ${validation.contains.includes('symbol') ? "textGreen" : "textRed"}`}>
                                                                <FontAwesomeIcon icon={validation.contains.includes('symbol') ? faCheckCircle : faTimesCircle} />
                                                                {" "}
                                                                {t("a symbol")}
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
                                                        isValid={Data.password === Data.passwordConfirm && (validation.value === "Medium" || validation.value === "Strong") }
                                                    />
                                                    <Form.Control.Feedback type="valid">{t("Looks good")}!</Form.Control.Feedback>
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
                                            <Col xs="12" className="d-flex justify-content-end">
                                                <Button variant="danger" type="submit" className='btn mainColor mt-4'>
                                                    {t("Confirm Password")}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    )
}

export default SetPassword