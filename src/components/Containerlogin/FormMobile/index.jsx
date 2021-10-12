import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Col, Row, Spinner, Card, Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

const FormMobile = () => {
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [error, setError] = useState("");
    const [buttonContent, setButtonContent] = useState("Login");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    let history = useHistory();
    const { t } = useTranslation();

    const toDashBoard = (path) => {
        history.push(`/dashboardNew/${path}`);
    }

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData(aux);
        setButtonDisabled(((data.password !== undefined && data.password !== "") && (data.username !== undefined && data.username !== "")) ? false : true)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setButtonDisabled(true)
        setLoading(true)
        setButtonContent("Loading")
        if (data.username === "admin" && data.password === "1234") {
            sessionStorage.setItem("admin", true)
            toDashBoard("addAccount");
            setError("")
        } else if (data.username === "user" && data.password === "1234") {
            sessionStorage.setItem("admin", false)
            toDashBoard("accounts");
            setError("")
        } else {
            setError("Sorry, the login failed! Please Try again")
            setButtonContent("Login")
            setButtonDisabled(false)
            setLoading(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="d-block d-lg-none mobile">
            <divz className="d-flex justify-content-center">
                <Card.Img className="mb-4" src={process.env.PUBLIC_URL + '/images/logo/logo.png'} />
            </divz>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                    <FontAwesomeIcon icon={faUser} />
                </InputGroup.Text>
                <FormControl
                    placeholder={t('Username or Email')}
                    autoComplete="username"
                    id="username"
                    onChange={handleChange}
                    required
                />
            </InputGroup>
            <Row className="d-flex flex-row-reverse">
                <Col xs="12">
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faLock} />
                        </InputGroup.Text>
                        <FormControl
                            type="password"
                            placeholder={t('Password')}
                            autoComplete="current-password"
                            onChange={handleChange}
                            id="password"
                            required
                        />
                    </InputGroup>
                </Col>
                <Col xs="12" className="text-right">
                    <h2 className="error">{t(error)}</h2>
                    <Button variant="link" size="sm" className="forgot" href="/forgotPassword">{t('Forgot Password?')}</Button>
                </Col>
            </Row>
            <Button type="submit" disabled={buttonDisabled} variant="danger" className="mainColor button block px-4 py-2">
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ display: loading ? "inline-block" : "none" }}
                />{' '}
                {t(buttonContent)}
            </Button>
        </Form>
    )
}
export default FormMobile