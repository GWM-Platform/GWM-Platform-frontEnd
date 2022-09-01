import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const UserItem = ({ client, user, getUsers }) => {
    const { t } = useTranslation()

    const { toLogin } = useContext(DashBoardContext)

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

    return (
        <div className="d-flex Actions py-2 align-items-center" style={{ borderBottom: " 1px solid lightgray" }}>
            <h4 className="mb-0 me-1 me-md-2">{t("User")}:&nbsp;#{user.id}</h4>
            <div className="me-auto px-1 px-md-2" style={{ borderLeft: "1px solid lightgray", borderRight: " 1px solid lightgray" }} >
                {t("Email")}:&nbsp;
                {user.email}
            </div>
            <button disabled={Request.fetching} className="noStyle iconContainer red" onClick={() => disconnectUserToClient()}>
                {Request.fetching ?
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    :
                    <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                }
            </button>
        </div>
    );
}

export default UserItem