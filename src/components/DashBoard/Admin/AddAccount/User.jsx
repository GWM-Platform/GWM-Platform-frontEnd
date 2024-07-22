import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Spinner, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers } from 'Slices/DashboardUtilities/usersSlice';
import MoreButton from 'components/DashBoard/GeneralUse/MoreButton';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { userId } from 'utils/userId';
import { selectAllclients } from 'Slices/DashboardUtilities/clientsSlice';
import { useMemo } from 'react';
import MultipleItemsCell from 'components/DashBoard/GeneralUse/MultipleItemsCell';
import { Link } from 'react-router-dom/cjs/react-router-dom';

export const User = ({ user }) => {
    const clients = useSelector(selectAllclients)

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
    const userClients = useMemo(() => clients.filter(client => client.users.find(clientUser => clientUser.userId === user.id)), [clients, user.id])

    return (
        <tr>
            <td className="Alias">{user?.email}</td>
            <td className="Alias">{user?.firstName || user?.lastName ? (user?.firstName + " " + user?.lastName) : "-"}</td>
            <td className="Alias">{user?.dni || "-"}</td>
            <td className="Alias">{user?.phone || "-"}</td>
            <td className="Alias">{user?.address || "-"}</td>
            <td className="Alias">
                <MultipleItemsCell
                    className='d-flex' buttonClassName="badge bg-info" buttonStyle={{ border: "none" }} array={userClients}
                    transformer={(client) => <Link style={{ color: "#66a4ff" }} to={`/DashBoard/clientsSupervision/${client.id}`}>{client.alias}</Link>}
                />
            </td>
            <td className="Alias">
                <div className="d-flex">
                    <MultipleItemsCell className='d-flex' buttonClassName="badge bg-info" buttonStyle={{ border: "none", padding: "var(--bs-badge-padding-y) var(--bs-badge-padding-x)" }} array={
                        [
                            <Badge size="sm" bg={user.enabled ? "success" : "danger"}>
                                {user.enabled ? t("Access enabled") : t("Access disabled")}
                            </Badge>,
                            <Badge size="sm" bg={user.verified ? "success" : "danger"}>
                                {user.verified ? t("Email verified") : t("Email not verified")}
                            </Badge>,
                            ...(currentUserId + "" === user.id + "") ?
                                [<Badge bg="info">
                                    {t("You")}
                                </Badge>] : [],
                            ...!!(user.isAdmin) ?
                                [
                                    <Badge bg="primary">
                                        {t("Administrator")}
                                    </Badge>
                                ] : []
                        ]
                    } />
                    <div className='d-inline-flex flex-wrap' style={{ gap: ".5em" }}>

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