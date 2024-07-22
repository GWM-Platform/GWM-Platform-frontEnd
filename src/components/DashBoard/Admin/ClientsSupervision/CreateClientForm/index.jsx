import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import './index.scss'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'

const CreateClientForm = ({ getClients }) => {
    const { t } = useTranslation()

    const { toLogin, DashboardToastDispatch } = useContext(DashBoardContext)
    const history = useHistory()

    const [validated, setValidated] = useState(false);
    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })
    const [data, setData] = useState(
        {
            firstName: "",
            lastName: "",
        }
    )

    const createClient = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/clients`, data)
            .then(function () {
                setRequest(() => (
                    {
                        fetching: false,
                        fetched: true,
                        valid: true,
                    }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Client created succesfully" } });
                getClients()
                history.push(`/DashBoard/clientsSupervision/`)
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") toLogin()
                    setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            createClient()
        }
        setValidated(true);
    }

    const handleChange = (e) => {
        setData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }))
    }

    return (
        <Container>
            <Row>
                <Col xs="12">
                    <div className="growOpacity section">
                        <div className="header">
                            <h1 className="title fw-normal">
                                {t("Create client")}
                            </h1>
                            <Link className="button icon" to={`/DashBoard/clientsSupervision`}>
                                <FontAwesomeIcon className="button icon" icon={faChevronCircleLeft} />
                            </Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Label>{t("First name")}</Form.Label>
                            <Form.Control
                                placeholder={t("First name")}
                                onChange={handleChange}
                                required
                                id="firstName"
                                value={data.firstName}
                                className="mb-2"
                            />

                            <Form.Label>{t("Last name")}</Form.Label>
                            <Form.Control
                                placeholder={t("Last name")}
                                onChange={handleChange}
                                required
                                id="lastName"
                                value={data.lastName}
                                className="mb-3"
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
                                {t("Submit")}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default CreateClientForm 