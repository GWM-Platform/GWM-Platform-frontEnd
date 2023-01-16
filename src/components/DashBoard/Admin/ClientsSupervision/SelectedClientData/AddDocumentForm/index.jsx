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
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import './index.scss'

const AddDocumentForm = ({ client, users }) => {
    const { t } = useTranslation()

    const { toLogin, DashboardToastDispatch } = useContext(DashBoardContext)
    const history = useHistory()

    const [validated, setValidated] = useState(false);
    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })
    const [data, setData] = useState(
        {
            name: "",
            link: ""
        }
    )

    const handleChange = (e) => { setData(prevState => ({ ...prevState, [e.target.id]: e.target.value })) }

    const addDocumentToClient = (clientId) => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/documents/client/${clientId}`, { name: data.name, link: data.link },
        ).then(function (response) {
            setRequest((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Document created successfully" } })


            history.push(`/DashBoard/clientsSupervision/${client.id}`)
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error while creating the document" } })

            }
        });
    }

    const handleSubmit = (event, clientId) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            addDocumentToClient(clientId)
        }
        setValidated(true);
    }


    return (
        <Container>
            <Row>
                <Col xs="12">
                    <div className="growOpacity section">
                        <div className="header">
                            <h1 className="title">
                                {t("Add document to client")}&nbsp;{client.alias}
                            </h1>
                            <Link className="button icon" to={`/DashBoard/clientsSupervision/${client.id}`}>
                                <FontAwesomeIcon className="button icon" icon={faChevronCircleLeft} />
                            </Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, client.id)}>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("Document Name")}</Form.Label>
                                <Form.Control
                                    onChange={handleChange}
                                    type="text"
                                    placeholder={t("Document Name")}
                                    required
                                    id="name"
                                    value={data.name}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("Document URL")}</Form.Label>
                                <Form.Control
                                    onChange={handleChange}
                                    type=""
                                    placeholder={t("Document URL")}
                                    required
                                    id="link"
                                    value={data.link}
                                />
                                <Form.Text className="text-success">
                                    {t("Make sure the client can access the document by making it public or giving access to user emails")}
                                </Form.Text>
                            </Form.Group>
                            {
                                Request.fetched &&
                                <div className="w-100 mb-2">
                                    <Form.Text className={!Request.valid ? "text-danger" : "text-success"}>
                                        {
                                            Request.valid ?
                                                t("Document created successfully")
                                                :
                                                t("The document could not be created")
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
                                {t("Submit")}</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AddDocumentForm 