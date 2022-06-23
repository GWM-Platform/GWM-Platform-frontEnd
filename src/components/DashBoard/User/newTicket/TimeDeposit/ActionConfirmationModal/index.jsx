import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js';

const ActionConfirmationModal = ({ setShowModal, show, action, data, Balance, fetching }) => {

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
                            {t("Product")}: <span className="emphasis">{t("Time deposit")}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Cash amount")}:<span className="emphasis"> U$D {data.amount}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Anual rate")}:<span className="emphasis"> 2%</span>
                        </li>
                        <li className="listedInfo">
                            {t("Investment after")}&nbsp;{data.days}&nbsp;{t("days")}:<span className="emphasis"> U$D
                                {(
                                    new Decimal(data.amount || 0).add(
                                        new Decimal(data.amount || 0).times(new Decimal(data.days|| 0).times(0.02).div(365).toString()).toString()
                                    ).toString()
                                )}</span>
                        </li>

                    </ul>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                <Button variant="outline-secondary" onClick={() => handleClose()}>
                    {t("Cancel")}
                </Button>
                <Button disabled={fetching} variant="outline-success" onClick={() => action()}>
                    <div className="iconContainer green">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default ActionConfirmationModal
