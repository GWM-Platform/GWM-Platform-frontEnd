import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import FixRequiredSelect from "components/DashBoard/GeneralUse/Forms/FixRequiredSelect";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import BaseSelect from "react-select";
import './index.scss'
const ConnectForm = ({ client, users, ownersAmount, clientUsers, getUsers }) => {
    const { t } = useTranslation()

    const { toLogin } = useContext(DashBoardContext)
    const history = useHistory()

    const [validated, setValidated] = useState(false);
    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })

    const [data, setData] = useState(
        {
            user: "",
            isOwner: ownersAmount === 0 ? true : false
        }
    )

    const connectUserToClient = (clientId) => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/clients/${clientId}/connect`, undefined, { params: { userId: data.user.value, isOwner: data.isOwner } },
        ).then(function (response) {
            setRequest((prevState) => (
                {
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            getUsers()
            history.push(`/DashBoard/clientsSupervision/${client.id}`)
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }

    const handleSubmit = (event, clientId) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            connectUserToClient(clientId)
        }
        setValidated(true);
    }

    const Select = props => (
        <FixRequiredSelect
            {...props}
            SelectComponent={BaseSelect}
            options={props.options}
        />
    );

    const userSelectedValid = () => data?.user.value

    return (
        <Container>
            <Row>
                <Col xs="12">
                    <div className="growOpacity section">
                        <div className="header">
                            <h1 className="title">
                                {t("Connect user to client")}&nbsp;{client.alias}
                            </h1>
                            <Link className="button icon" to={`/DashBoard/clientsSupervision/${client.id}`}>
                                <FontAwesomeIcon className="button icon" icon={faChevronCircleLeft} />
                            </Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, client.id)}>
                            <Form.Label>{t("Select the user you want to connect to the client")}</Form.Label>
                            <Select
                                classNamePrefix="react-select"
                                valid={validated ? userSelectedValid() : false}
                                invalid={validated ? !userSelectedValid() : false}
                                className="mb-2" required value={data.user} placeholder={false} noOptionsMessage={() => t('No users found')}
                                onChange={(val) => {
                                    setData(prevState => ({ ...prevState, user: val }));
                                    setRequest(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                                }}
                                options={users.content.map((user, key) => (
                                    {
                                        label: `${t("Number")}: ${user.id} / ${t("Email")}: ${user.email}`,
                                        value: user.id,
                                        isDisabled: clientUsers?.content?.filter(clientUser => clientUser?.id === user?.id).length > 0
                                    }
                                ))}
                            />
                            <Form.Check
                                checked={data.isOwner}
                                onChange={e => setData(prevState => ({ ...prevState, isOwner: e.target.checked }))}
                                disabled={ownersAmount === 0}
                                label={t("Client owner")}
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
                                {t("Submit")}</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ConnectForm 