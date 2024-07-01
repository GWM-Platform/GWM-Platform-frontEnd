import React, { useCallback, useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Table, Accordion, Badge, Spinner, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import BaseSelect from "react-select";
import FixRequiredSelect from 'components/DashBoard/GeneralUse/Forms/FixRequiredSelect';
import { Route, Switch, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers, selectAllusers } from 'Slices/DashboardUtilities/usersSlice';
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import EmptyTable from "components/DashBoard/GeneralUse/EmptyTable";
import { ContextAwareToggle } from '../Operations/OperationsTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import MoreButton from 'components/DashBoard/GeneralUse/MoreButton';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { userId } from 'utils/userId';

const AddAccount = () => {
    const { toLogin } = useContext(DashBoardContext)
    const [clients, setClients] = useState({ fetching: true, fetched: false, valid: false, content: [] })
    const getClients = useCallback((signal) => {
        setClients((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/clients`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setClients((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setClients((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setClients]);


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getClients(signal)

        return () => {
            controller.abort();
        };
    }, [getClients])


    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                <Switch>
                    <Route exact path="/DashBoard/users">
                        <UsersTable />
                    </Route>
                    <Route path="/DashBoard/users/creation">
                        <Add clients={clients} />
                    </Route>
                </Switch>

            </Row>
        </Container>
    )
}
export default AddAccount
const UsersTable = () => {
    const { t } = useTranslation();

    const usersStatus = useSelector(state => state.users.status)
    const users = useSelector(selectAllusers)
    const dispatch = useDispatch()
    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchusers({ all: true }))
        }
    }, [dispatch, usersStatus])

    const history = useHistory()

    return (
        <Col className="section growOpacity h-100 d-flex flex-column">
            <Accordion style={{ borderBottom: "1px solid #b3b3b3", marginTop: "0.5em", fontSize: "30px" }} >
                <ContextAwareToggle buttonText="Add user" eventKey="0" create={() => history.push("/DashBoard/users/creation")}>
                    {t("Users")}
                </ContextAwareToggle>
                <Accordion.Collapse eventKey="0">
                    <Form noValidate>
                        <Row className="pt-2 g-2">
                            <div className="w-100 m-0 mb-2" />
                        </Row>
                    </Form>
                </Accordion.Collapse>
            </Accordion>
            {
                users?.length === 0 ?
                    usersStatus === "loading" ?
                        <Loading className="h-100 mb-5" />
                        :
                        <EmptyTable className="h-100 mb-5" />
                    :
                    <div className="py-3 w-100">
                        <div className="w-100 overflow-auto">
                            <Table className="ClientsTable mb-0" striped bordered hover>
                                <thead className="verticalTop tableHeader solid-bg">
                                    <tr>
                                        <th className="id">{t("Email")}</th>
                                        <th className="Alias">{t("Name")}</th>
                                        <th className="Alias">{t("DNI")}</th>
                                        <th className="Balance">{t("Phone")}</th>
                                        <th className="Balance">{t("Address")}</th>
                                        <th className="Balance"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => <User key={user.id} user={user} />)}
                                </tbody>
                            </Table>
                        </div>
                    </div>

            }

        </Col>)
}
const Add = ({ clients }) => {
    const dispatch = useDispatch()
    const { toLogin } = useContext(DashBoardContext)
    const { t } = useTranslation();
    const [formData, setFormData] = useState(
        {
            email: "",
            firstName: "",
            lastName: "",
            type: "",
            client: "",
            isOwner: false
        }
    )

    const [message, setMessage] = useState()

    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const handleChange = (event) => {
        setFormData(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    };

    const handleChangeCheck = (event) => {
        setFormData(prevState => ({ ...prevState, [event.target.id]: event.target.checked }));
    }

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
        axios.post(`/clients/signup`,
            formData.type === "1" ? {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            } :
                {
                    email: formData.email,
                    clientId: formData.client.value,
                    isOwner: formData.isOwner
                }
        ).then(function (response) {
            setMessage("La cuenta ha sido creada con exito, se enviara un link de verificacion al mail especificado")
            setButtonDisabled(false)
            dispatch(fetchusers({ all: true }))

            history.push("/DashBoard/users")
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                if (err.response.status === "501") {
                    setMessage("Server error. Try it again later")
                } else {
                    setMessage("Error. Verify the entered data")
                }
            }
        });
    }

    const Select = props => (
        <FixRequiredSelect
            {...props}
            SelectComponent={BaseSelect}
            options={props.options}
        />
    );


    const clientSelectedValid = () => formData?.client.value
    const history = useHistory()

    return (
        <Col className="growOpacity section editForm">
            <div className="header" style={{ borderBottomColor: "#b3b3b3" }}>
                <h1 className="title">
                    {t("Add user")}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => history.push("/DashBoard/users")} icon={faChevronCircleLeft} />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>{t("Email")}</Form.Label>
                    <Form.Control
                        onChange={handleChange}
                        type="email"
                        placeholder={t("Email")}
                        required
                        id="email"
                        value={formData.email}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>{t("Connect the new user to a")}</Form.Label>
                    <Form.Select required onChange={handleChange} value={formData.type} id="type" aria-label="Select type">
                        <option value="" disabled>{t("Open this select menu")}</option>
                        <option value="1" >{t("New client")}</option>
                        <option value="2" >{t("Existing client")}</option>
                    </Form.Select>
                </Form.Group>

                {
                    formData.type !== "" &&
                    (
                        formData.type === "1" ?
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t("First Name")}</Form.Label>
                                    <Form.Control
                                        value={formData.firstName}
                                        required
                                        id="firstName"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder={t("First Name")}
                                    />
                                </Form.Group>


                                <Form.Group className="mb-3">
                                    <Form.Label>{t("Last Name")}</Form.Label>
                                    <Form.Control
                                        value={formData.lastName}
                                        required
                                        id="lastName"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder={t("Last Name")}
                                    />
                                </Form.Group>
                            </>
                            :
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t("Select the client to witch you want to connect the user")}</Form.Label>
                                    <Select
                                        classNamePrefix="react-select"
                                        valid={validated ? clientSelectedValid() : false}
                                        invalid={validated ? !clientSelectedValid() : false}

                                        className="mb-3" required value={formData.client} placeholder={false} noOptionsMessage={() => t('No clients found')}
                                        onChange={(val) => {
                                            setFormData(prevState => ({ ...prevState, client: val }));
                                        }}
                                        options={clients.content.map((client, key) => (
                                            {
                                                label: `${t("Number")}: ${client.id} / ${t("Alias")}: ${client.alias} / ${t("First name")}: ${client.firstName} ${t("Last name")}: ${client.lastName}`,
                                                value: client.id
                                            }
                                        ))}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="isOwner">
                                    <Form.Check checked={formData.isOwner} onChange={handleChangeCheck} type="checkbox" label={t("Create user as owner of the selected client")} />
                                </Form.Group>
                            </>
                    )
                }

                <p>{t(message)}</p>
                <Button disabled={buttonDisabled} variant="danger" type="submit">{t("Submit")}</Button>
            </Form>
        </Col>
    )
}

const User = ({ user }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const { toLogin, DashboardToastDispatch } = useContext(DashBoardContext)
    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })

    const resendActivationEmail = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/users/resendVerification`, { email: user.email },
        ).then(function () {
            setRequest(() => (
                {
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Activation email successfully resent" } })
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error resending the activation email" } })

            }
        });
    }

    const toggleUserStatus = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.patch(`/users/${user.id}/${user.enabled ? "disable" : "enable"}`)
            .then(function (response) {
                setRequest(() => (
                    {
                        fetching: false,
                        fetched: true,
                        valid: true,
                    }))
                dispatch(fetchusers({ all: true }))

            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") toLogin()
                    setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            });
    }
    const currentUserId = userId()

    return (
        <tr>
            <td className="Alias">{user?.email}</td>
            <td className="Alias">{user?.firstName || user?.lastName ? (user?.firstName + " " + user?.lastName) : "-"}</td>
            <td className="Alias">{user?.dni || "-"}</td>
            <td className="Alias">{user?.phone || "-"}</td>
            <td className="Alias">{user?.address || "-"}</td>
            <td className="Alias">
                <div className="d-flex">
                    <div className='d-inline-flex flex-wrap' style={{ gap: ".5em" }}>
                        {
                            currentUserId + "" === user.id + "" &&
                            <Badge bg="info">
                                {t("You")}
                            </Badge>
                        }
                        {
                            !!(user.isAdmin) &&
                            <Badge bg="primary">
                                {t("Administrator")}
                            </Badge>
                        }
                        <Badge size="sm" bg={user.verified ? "success" : "danger"}>
                            {
                                user.verified ?
                                    t("Email verified")
                                    :
                                    t("Email not verified")
                            }
                        </Badge>
                        <Badge size="sm" bg={user.enabled ? "success" : "danger"}>
                            {
                                user.enabled ?
                                    t("Access enabled")
                                    :
                                    t("Access disabled")
                            }
                        </Badge>
                    </div>
                    {
                        currentUserId + "" !== user.id + "" &&
                        <div className="ms-auto" style={{ minWidth: "3ch" }}>
                            {
                                Request.fetching ?
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    :
                                    <Dropdown
                                        id={`dropdown-button-drop-start`}
                                        drop="start"
                                        variant="secondary"
                                        title={t(`User options`)}
                                        className="d-flex justify-content-end"
                                        disabled={Request.fetching}
                                    >
                                        <Dropdown.Toggle as={MoreButton} id="dropdown-custom-components" />
                                        <Dropdown.Menu >
                                            {
                                                !user.verified &&
                                                <Dropdown.Item onClick={() => resendActivationEmail()}>
                                                    {t('Resend activation email')}
                                                </Dropdown.Item>
                                            }
                                            <Dropdown.Item onClick={toggleUserStatus}>
                                                {t(user.enabled ? 'Disable access' : 'Enable access')}
                                            </Dropdown.Item>
                                        </Dropdown.Menu >
                                    </Dropdown>
                            }
                        </div>
                    }
                </div>
            </td>
        </tr>
    );
}