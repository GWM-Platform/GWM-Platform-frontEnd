import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const ActionConfirmationModal = ({ setShowModal, show, action, data, Balance }) => {

    const { t } = useTranslation();

    const { ClientSelected } = useContext(DashBoardContext)

    const handleClose = () => {
        setShowModal(false)
    }

    return (
        <Modal className="confirmationModal" size="auto" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div>
                    <h1 className="title"> {t("Ticket summary")} </h1>
                    <ul>
                        <li className="listedInfo">
                            {t("Account")}: <span className="emphasis">{ClientSelected.alias}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Account balance")}: <span className="emphasis">${Balance}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Product")}: <span className="emphasis"></span>
                        </li>
                        <li className="listedInfo">
                            {t("Cash amount")}:<span className="emphasis"> ${data.amount}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Share amount")}:<span className="emphasis"> </span>
                        </li>

                    </ul>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                <Button variant="outline-secondary" onClick={() => handleClose()}>
                    {t("Cancel")}
                </Button>
                <Button disabled={false} variant="outline-success" onClick={() => { action() }}>
                    <div className="iconContainer green">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default ActionConfirmationModal
