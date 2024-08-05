import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import './index.scss'

const DocumentForm = ({ client, documents }) => {

    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }
    const id = useQuery().get("i")
    const selectedDocument = documents?.content?.find(Document => Document?.id + "" === id)

    const { t } = useTranslation()

    const { toLogin, DashboardToastDispatch } = useContext(DashBoardContext)
    const history = useHistory()

    const [validated, setValidated] = useState(false);
    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })
    const [data, setData] = useState(
        {
            name: selectedDocument ? selectedDocument?.name || "" : "",
            link: selectedDocument ? selectedDocument?.link || "" : "",
            adminDocument: selectedDocument ? selectedDocument?.adminDocument || false : false,
        }
    )

    const handleChange = (e) => { setData(prevState => ({ ...prevState, [e.target.id]: e.target.type === "checkbox" ? e.target.checked : e.target.value })) }

    const addDocumentToClient = (clientId) => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/documents/client/${clientId}`, { name: data.name, link: data.link, adminDocument: data.adminDocument },)
            .then(function (response) {
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

    const editDocument = (clientId) => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.patch(`/documents/${id}`, { name: data.name, link: data.link, adminDocument: data.adminDocument },)
            .then(function (response) {
                setRequest((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                    }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Document edited successfully" } })


                history.push(`/DashBoard/clientsSupervision/${client.id}`)
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") toLogin()
                    setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                    DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "The document could not be edited" } })

                }
            });
    }

    const handleSubmit = (event, clientId) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() && !Request.fetching) {
            selectedDocument ?
                editDocument(clientId)
                :
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

                                {
                                    selectedDocument ?
                                        t("Edit document \"{{documentName}}\" from client", { documentName: selectedDocument.name })
                                        :
                                        t("Add document to client")
                                }&nbsp;{client.alias}
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
                                <Form.Control.Feedback type="invalid">
                                    {t("You must enter a name for the document")}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid">
                                    {t("Looks good")}!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("Google drive file URL")}</Form.Label>
                                <Form.Control
                                    onChange={handleChange}
                                    type=""
                                    placeholder={t("Google drive file URL")}
                                    required
                                    pattern="^https?://(www\.)?drive.google.com/file/d/.+"
                                    id="link"
                                    value={data.link}
                                />
                                {
                                    validated ?
                                        <>
                                            <Form.Control.Feedback type="invalid">
                                                {t("The URL entered does not correspond to a google drive file")}
                                            </Form.Control.Feedback>
                                            <Form.Control.Feedback type="valid">
                                                {t("Looks good")}!
                                            </Form.Control.Feedback>
                                        </>
                                        :
                                        <Form.Text className="text-success">
                                            {t("Make sure the file is shared, or inside a shared folder, with the account ({{serviceAccount}})", { serviceAccount: process.env.REACT_APP_GDRIVESERVICEACCOUTEMAIL })}
                                        </Form.Text>

                                }
                            </Form.Group>
                            <Form.Check className="mb-3" onChange={handleChange} readOnly id="adminDocument" checked={data.adminDocument} label={t("Document visible only by administrators")} />
                            {
                                Request.fetched &&
                                <div className="w-100 mb-2">
                                    <Form.Text className={!Request.valid ? "text-danger" : "text-success"}>
                                        {
                                            Request.valid ?
                                                selectedDocument ?
                                                    t("Document edited successfully")
                                                    :
                                                    t("Document created successfully")
                                                :
                                                selectedDocument ?
                                                    t("The document could not be edited")
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

export default DocumentForm 