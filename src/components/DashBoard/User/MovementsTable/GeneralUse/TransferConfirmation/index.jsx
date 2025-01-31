import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { useEffect } from 'react';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import { useContext } from 'react';
import { customFetch } from 'utils/customFetch';

const TransferConfirmation = ({ isMovement = false, movement, setShowModal, action, show, reloadData }) => {

    const { AccountSelected } = useContext(DashBoardContext)


    const { t } = useTranslation();
    const { ClientSelected } = useContext(DashBoardContext)
    const [ActionFetch, setActionFetch] = useState({ fetched: false, fetching: false, valid: false })
    const [Transfer, setTransfer] = useState(isMovement ? {} : movement)

    const incomingTransfer = () => movement.receiverId === AccountSelected?.id

    useEffect(() => {
        if (isMovement) {
            axios.get(`/transfers/${movement.transferId}`, { params: { client: ClientSelected.id } })
                .then((response) => {
                    setTransfer(response.data)
                }
                )
                .catch(
                    (e) => {
                        console.error(e)
                    }
                )
        }
    }, [movement, isMovement, ClientSelected.id])


    const handleClose = () => {
        setActionFetch({
            ...ActionFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setShowModal(false)
    }


    const changeTransferState = async () => {
        setActionFetch({
            ...ActionFetch,
            fetching: true,
            fetched: false,
            valid: false
        })

        const url = `${process.env.REACT_APP_APIURL}/transfers/${Transfer?.id}/${action}`;
        const token = sessionStorage.getItem("access_token")

        const response = await customFetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status >= 200 && response.status < 300) {
            setActionFetch({
                ...ActionFetch,
                fetching: false,
                fetched: true,
                valid: true
            })
        } else {
            setActionFetch({
                ...ActionFetch,
                fetching: false,
                fetched: true,
                valid: false
            })
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Modal className="deleteModal" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={!ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    <div className="d-flex justify-content-center align-items-center">
                        <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                            <FontAwesomeIcon
                                className="p-absolute"
                                color="red"
                                icon={faExclamation}
                                style={{
                                    transform: "translate(-50%, -50%)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon

                                color="red"
                                icon={faCircle}
                                className="p-absolute"
                                style={{
                                    transform: "translate(-50%, -50%) scale(1.5)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                        </h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to")} {t(action === "deny" ? (isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ? action : "cancel" : action)} {t("transfer #")}{Transfer?.id}</h2>
                    <ul>
                        <li className="listedInfo">
                            {t("Operation")}:&nbsp;
                            <span className="emphasis">
                                {
                                    t(
                                        `${(isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ?
                                            "Incoming"
                                            :
                                            "Outgoing"
                                        } transfer`
                                    )
                                }
                            </span>
                        </li>
                        <li className="listedInfo">
                            {t(`Transfer from`)}:&nbsp;
                            <span className="emphasis text-nowrap">{Transfer?.senderAlias}
                                {
                                    !(isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ?
                                        <>&nbsp;({t("You")})</>
                                        :
                                        ""
                                }
                            </span>
                        </li>
                        <li className="listedInfo">
                            {t(`Transfer to`)}:&nbsp;
                            <span className="emphasis text-nowrap">
                                {Transfer?.receiverAlias}
                                {
                                    (isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ?
                                        <>&nbsp;({t("You")})</>
                                        :
                                        ""
                                }
                            </span>
                        </li>
                        {
                            !!(Transfer?.notes?.find(note => note?.noteType === "TRANSFER_MOTIVE")) &&
                            <li className="listedInfo">
                                {t('Transfer note')}:
                                <span> "{Transfer?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")?.text}"</span>
                            </li>
                        }
                    </ul>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
                <div className={ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    {
                        ActionFetch.valid ?
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="green"
                                            icon={faCheck}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="green"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("The ticket has been")} {t(action === "approve" ? "approved" : (isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ? "denied" : "cancelled")} {t("succesfully")}</h2>
                            </>
                            :
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="red"
                                            icon={faTimes}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="red"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("Failed to")}{" "}{t(action)}{" "}{t("the ticket")}</h2>
                            </>
                    }

                </div>
                <div className="placeHolder">
                    <div className="d-flex justify-content-center align-items-center">
                        <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                            <FontAwesomeIcon
                                className="p-absolute"
                                color="red"
                                icon={faExclamation}
                                style={{
                                    transform: "translate(-50%, -50%)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon

                                color="red"
                                icon={faCircle}
                                className="p-absolute"
                                style={{
                                    transform: "translate(-50%, -50%) scale(1.5)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                        </h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to")} {t(action)} {t("transfer #")} {Transfer?.id}</h2>
                    <ul>
                        <li className="listedInfo">
                            {t("Operation")}:&nbsp;
                            <span className="emphasis">
                                {
                                    t(
                                        `${(isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ?
                                            "Incoming"
                                            :
                                            "Outgoing"
                                        } transfer`
                                    )
                                }
                            </span>
                        </li>
                        <li className="listedInfo">
                            {t(`Transfer from`)}:&nbsp;
                            <span className="emphasis text-nowrap">{Transfer?.senderAlias}
                                {
                                    !(isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ?
                                        <>&nbsp;({t("You")})</>
                                        :
                                        ""
                                }
                            </span>
                        </li>
                        <li className="listedInfo">
                            {t(`Transfer to`)}:&nbsp;
                            <span className="emphasis text-nowrap">
                                {Transfer?.receiverAlias}
                                {
                                    (isMovement ? (movement.motive === "TRANSFER_RECEIVE") : incomingTransfer()) ?
                                        <>&nbsp;({t("You")})</>
                                        :
                                        ""
                                }
                            </span>
                        </li>
                        {
                            !!(Transfer?.notes?.find(note => note?.noteType === "TRANSFER_MOTIVE")) &&
                            <li className="listedInfo">
                                {t('Transfer note')}:
                                <span> "{Transfer?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")?.text}"</span>
                            </li>
                        }
                    </ul>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    ActionFetch.fetched ?
                        <Button variant="outline-secondary" onClick={() => { reloadData(); handleClose() }}>
                            {t("Close")}
                        </Button>
                        :
                        <>

                            <Button variant="outline-secondary" onClick={() => handleClose()}>
                                {t("Cancel")}
                            </Button>
                            <Button variant="outline-success" onClick={() => { if (!ActionFetch.fetching) changeTransferState() }}>
                                <div className="iconContainer green">
                                    {t("Confirm")}
                                </div>
                            </Button>
                        </>
                }

            </Modal.Footer>
        </Modal>
    )
}
export default TransferConfirmation
