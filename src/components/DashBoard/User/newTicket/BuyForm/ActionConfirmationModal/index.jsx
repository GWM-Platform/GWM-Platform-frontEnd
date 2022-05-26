import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js';

const ActionConfirmationModal = ({ setShowModal, show, action, data, Funds, Balance, fetching }) => {

    const { t } = useTranslation();

    const { ClientSelected } = useContext(DashBoardContext)

    const handleClose = () => {
        setShowModal(false)
    }

    const amountDecimal = new Decimal(data.amount.length === 0 ? 0 : data.amount)
    const sharePriceDecimal = new Decimal(Funds[data.FundSelected]?.sharePrice || 1)
    const sharesToBuy = new Decimal(amountDecimal).div(sharePriceDecimal).toFixed(5)

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
                            {t("Product")}: <span className="emphasis">{Funds[data.FundSelected].name}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Cash amount")}:<span className="emphasis"> U$D {data.amount}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Share amount")}:<span className="emphasis"> {sharesToBuy.toString()}</span>
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
