import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const ActionConfirmationModal = ({ setShowModal, show, action, data, Funds, Balance, fetching }) => {
    Decimal.set({ precision: 100 })

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
                            {t("Account balance")}: <FormattedNumber className="emphasis" prefix="U$D " value={Balance} fixedDecimals={2}/>
                        </li>
                        <li className="listedInfo">
                            {t("Product")}: <span className="emphasis">{Funds[data.FundSelected].name}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Cash amount")}:<span className="emphasis"> <FormattedNumber prefix="U$D " value={data.amount} fixedDecimals={2}/></span>
                        </li>
                        <li className="listedInfo">
                            {t("Share amount")}:<span className="emphasis"> <FormattedNumber prefix="" value={sharesToBuy.toString()} fixedDecimals={2}/></span>
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
