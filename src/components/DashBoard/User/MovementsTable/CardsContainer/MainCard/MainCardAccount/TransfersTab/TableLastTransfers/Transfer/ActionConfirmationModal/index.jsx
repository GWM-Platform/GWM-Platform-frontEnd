import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { DashBoardContext } from 'context/DashBoardContext';


const ActionConfirmationModal = ({ incomingTransfer, movement, setShowModal, action, show, reloadData }) => {
    const { t } = useTranslation();
    const [ActionFetch, setActionFetch] = useState({ fetched: false, fetching: false, valid: false })

    const { AccountSelected } = useContext(DashBoardContext)

    const accountAlias = AccountSelected?.alias

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

        const url = `${process.env.REACT_APP_APIURL}/transfers/${movement.id}/${action}`;
        const token = sessionStorage.getItem("access_token")

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
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
                    <div className="descriptionIconContainer red mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faExclamation} /></h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to")} {t(action)} {t("the transfer with the id")} {movement.id}</h2>
                    <ul>
                        <li className="listedInfo">
                            {t("Operation")}: <span className="emphasis">{t(`${incomingTransfer ? "Incoming" : "Outgoing"} transfer`)}</span>
                            {
                                incomingTransfer ?
                                    <>
                                        <li className="listedInfo">
                                            {t("Source account alias")}: <span className="emphasis">Alias del que manda</span>
                                        </li>
                                        <li className="listedInfo">
                                            {t("Target account (Yours)")}: <span className="emphasis">{accountAlias}</span>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li className="listedInfo">
                                            {t("Source account (Yours) alias")}: <span className="emphasis">{accountAlias}</span>
                                        </li>
                                        <li className="listedInfo">
                                            {t("Target account")}: <span className="emphasis">Alias del que manda</span>
                                        </li>
                                    </>
                            }
                            <li className="listedInfo">
                                {t("Cash operation amount")}: <span className="emphasis">${movement.amount}</span>
                            </li>
                            <li className="listedInfo">
                                {t("Balance after approving this transfer")}:&nbsp; 
                                <span className="emphasis">
                                    ${AccountSelected?.balance + movement.amount * (incomingTransfer ? 1 : -1)}
                                    <span className={incomingTransfer ? "text-green" : "text-red"}>&nbsp;({incomingTransfer ? "+" : "-"}{movement.amount})</span> 
                                </span>
                            </li>
                        </li>
                    </ul>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
                <div className={ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    {
                        ActionFetch.valid ?
                            <>
                                <div className="descriptionIconContainer green mx-auto">
                                    <h1 className="title"><FontAwesomeIcon className="icon green" icon={faCheck} /></h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("The ticket has been")} {t(action === "approve" ? "approved" : "denied")} {t("succesfully")}</h2>
                            </>
                            :
                            <>
                                <div className="descriptionIconContainer green mx-auto">
                                    <h1 className="title"><FontAwesomeIcon className="icon green" icon={faTimes} /></h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("Failed to")}{" "}{t(action)}{" "}{t("the ticket")}</h2>
                            </>
                    }

                </div>
                <div className="placeHolder">
                    <div className="descriptionIconContainer red mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faExclamation} /></h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to")} {t(action)} {t("the transfer with the id")} {movement.id}</h2>
                    <ul>
                        <li className="listedInfo">
                            {t("Operation")}: <span className="emphasis">{t(`${incomingTransfer ? "Incoming" : "Outgoing"} transfer`)}</span>
                            {
                                incomingTransfer ?
                                    <>
                                        <li className="listedInfo">
                                            {t("Source account alias")}: <span className="emphasis">Alias del que manda</span>
                                        </li>
                                        <li className="listedInfo">
                                            {t("Target account (Yours)")}: <span className="emphasis">{accountAlias}</span>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li className="listedInfo">
                                            {t("Source account (Yours) alias ")}: <span className="emphasis">{accountAlias}</span>
                                        </li>
                                        <li className="listedInfo">
                                            {t("Target account ")}: <span className="emphasis">Alias del que manda</span>
                                        </li>
                                    </>
                            }
                            <li className="listedInfo">
                                {t("Cash operation amount")}: <span className="emphasis">${movement.amount}</span>
                            </li>
                            <li className="listedInfo">
                                {t("Your account balance if you approve this transfer")}: <span className="emphasis">${AccountSelected?.balance + movement.amount * (incomingTransfer ? 1 : -1)}</span>
                            </li>
                        </li>
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
export default ActionConfirmationModal
