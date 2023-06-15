import { faCheckCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import MoreButton from "components/DashBoard/GeneralUse/MoreButton";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Badge, Dropdown, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const UserItem = ({ ownersAmount, client, user, getUsers }) => {
    const { t } = useTranslation()

    const { toLogin, DashboardToastDispatch } = useContext(DashBoardContext)

    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })

    const disconnectUserToClient = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.delete(`/clients/${client.id}/disconnect`, { params: { userId: user.id } },
        ).then(function (response) {
            setRequest((prevState) => (
                {
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            getUsers()
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }

    const assignOwner = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/clients/${client.id}/assignOwner`, undefined, { params: { userId: user.id } },
        ).then(function (response) {
            setRequest((prevState) => (
                {
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            getUsers()
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }

    const unAssignOwner = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/clients/${client.id}/unassignOwner`, undefined, { params: { userId: user.id } },
        ).then(function () {
            setRequest(() => (
                {
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            getUsers()
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }

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

    return (
        <div className="d-flex Actions py-2 align-items-center user" style={{ borderBottom: " 1px solid lightgray" }}>
            <div className="mb-0 pe-1 pe-md-2" >
                <h1 className="title d-flex align-items-center">{t("User")}&nbsp;#{user.id}
                    {
                        !!(user.isOwner) &&
                        <>
                            &nbsp;
                            <Badge bg="primary">
                                {t("Owner")}
                            </Badge>
                        </>
                    }
                    &nbsp;
                    <Badge size="sm" bg={user.verified ? "success" : "danger"}>
                        {
                            user.verified ?
                                t("Active")
                                :
                                t("Not active")
                        }
                    </Badge>
                </h1>
                <h2 className="email">
                    {t("Email")}:&nbsp;
                    {user.email}
                </h2>
                {
                    (user.firstName || user.lastName) &&
                    <h2 className="email">
                        {t("Name")}:&nbsp;
                        {user.firstName} {user.lastName}
                    </h2>
                }
            </div>

            <div className="ms-auto">
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
                                    user.isOwner ?
                                        <Dropdown.Item disabled={ownersAmount === 1} onClick={() => unAssignOwner()}>
                                            {t('Unassign as owner')}
                                        </Dropdown.Item>
                                        :
                                        <Dropdown.Item onClick={() => assignOwner()}>
                                            {t('Assign as owner')}
                                        </Dropdown.Item>
                                }
                                {
                                    !user.verified &&
                                    <Dropdown.Item onClick={() => resendActivationEmail()}>
                                        {t('Resend activation email')}
                                    </Dropdown.Item>
                                }
                                <Dropdown.Divider />
                                <Dropdown.Item disabled={user.isOwner && ownersAmount === 1} onClick={() => disconnectUserToClient()} >
                                    {t('Disconnect user')}
                                </Dropdown.Item>
                            </Dropdown.Menu >
                        </Dropdown>
                }
            </div>
        </div>
    );
}

export default UserItem