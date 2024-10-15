import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import BaseSelect from "react-select";
import FixRequiredSelect from 'components/DashBoard/GeneralUse/Forms/FixRequiredSelect';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers } from 'Slices/DashboardUtilities/usersSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { selectAllclients } from 'Slices/DashboardUtilities/clientsSlice';

export const Add = () => {
    const clients = useSelector(selectAllclients)

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
                <h1 className="title fw-normal">
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
                                        options={clients.map((client, key) => (
                                            {
                                                label: `${t("Number")}: ${client.id} / ${t("Alias")}: ${client.alias} / ${t("First name")}: ${client.firstName} ${t("Last name")}: ${client.lastName}`,
                                                value: client.id,
                                                isDisabled: !client.enabled
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