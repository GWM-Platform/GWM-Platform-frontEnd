import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { dashboardContext } from '../../../../../../context/dashboardContext';

const ActionConfirmationModal = ({ setShowModal, show, action, data, Funds, Balance,fetching }) => {
    const { t } = useTranslation();
    const { ClientSelected } = useContext(dashboardContext)
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
                            {t("Client with whom the operation will be made")}: <span className="emphasis">{ClientSelected.alias}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Available cash")}: <span className="emphasis">${Balance}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Fund selected")}: <span className="emphasis">{Funds[data.FundSelected].fund.name}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Selling (in feeParts)")}:<span className="emphasis"> {data.shares}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Selling (in cash)")}:<span className="emphasis"> ${(data.shares * Funds[data.FundSelected].fund.sharePrice).toFixed(2)}</span>
                        </li>
                        
                    </ul>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                <Button variant="outline-secondary" onClick={() => handleClose()}>
                    {t("Cancel")}
                </Button>
                <Button disabled={fetching} variant="outline-success" onClick={() => { action() }}>
                    <div className="iconContainer green">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default ActionConfirmationModal
