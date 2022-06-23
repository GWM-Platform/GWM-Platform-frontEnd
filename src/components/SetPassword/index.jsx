import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { passwordStrength } from 'check-password-strength'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';
import LanguageSelector from 'components/LanguageSelector';
import './index.scss'

const SetPassword = () => {
    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const toDashBoard = () => {
        history.push(`/DashBoard/accounts`);
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

        if (response.status === 201) {
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

    const [ShowRequirements, setShowRequirements] = useState(false)
    const symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

    return (
        <div className="setPassword growOpacity">
            <div className="languageSelectorContainer">
                <LanguageSelector />
            </div>
            <Container >
                <Row className="justify-content-center d-flex">
                    <Col xs="11" lg="8">
                        <Card className="Card">
                            <Card.Body className="growOpacity" >
                                {Data.passwordChanged ?
                                    <div className="result growOpacity">
                                        <h1 className="icon" >
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </h1>
                                        <h2 className="label">
                                            {t("Password has been changed successfully.")}
                                        </h2>
                                        <Col xs="12" className="d-flex justify-content-center">
                                            <Button variant="danger" onClick={() => toDashBoard()} className='btn mainColor mt-4'>
                                                {t("To DashBoard")}
                                            </Button>
                                        </Col>
                                    </div>
                                    :
                                    <div className="growOpacity">

                                        <div className="d-flex align-items-center mb-2">
                                            <h1 className="mb-0" style={{ height: "1em" }}>
                                                <img className='d-block h-100' src={process.env.PUBLIC_URL + '/images/logo/logo.svg'} alt="" />
                                            </h1>
                                            <h1 className="mb-0" style={{ height: "1em" }}>
                                                <div style={{ height: "100%", width: "1px", margin: "0 10px", border: "1px solid gray" }}></div>
                                            </h1>
                                            <h1 className="mb-0">{t("Welcome to Global Wealth Management!")}</h1>
                                        </div>
                                        <h2 className='mb-2'>{t("Thank you for choosing us!")}</h2>
                                        <h3>{t("To get started, you need to set up your new password")}</h3>

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
                                                            onFocus={() => setShowRequirements(true)}
                                                            onBlur={() => setShowRequirements(false)}
                                                        />
                                                        <Form.Control.Feedback>{t("Looks good")}!</Form.Control.Feedback>
                                                        <div className={ShowRequirements ? "expanded" : "collapsed"}>
                                                            <Form.Text className={`text-muted formText mb-4`}>
                                                                <p className="validation mb-1 ">{t("Your new password must have")}:
                                                                    <br />
                                                                    {validationIcon(validation.length >= 8)}
                                                                    {t("8 characters length")}
                                                                    <br />
                                                                    {validationIcon(validation.contains.includes('number'))}
                                                                    {t("A number")}
                                                                    <br />
                                                                    {validationIcon(validation.contains.includes('lowercase'))}
                                                                    {t("A lowercase letter")}
                                                                    <br />
                                                                    {validationIcon(validation.contains.includes('uppercase'))}
                                                                    {t("A capital letter")}
                                                                    <br />
                                                                    {validationIcon(validation.contains.includes('symbol'))}
                                                                    {t("A symbol")} ({symbols})
                                                                </p>
                                                            </Form.Text>
                                                        </div>
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
                                                            isValid={Data.password === Data.passwordConfirm && (validation.value === "Medium" || validation.value === "Strong")}
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
                                                        {t("Confirm password")}
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
        </div>


    )
}

export default SetPassword

const validationIcon = (valid) => {
    if (valid) {
        return <span className="pe-1 textGreen"> <FontAwesomeIcon icon={faCheckCircle} /></span>
    } else {
        return <span className="pe-1 textRed"> <FontAwesomeIcon icon={faTimesCircle} /></span>
    }
}