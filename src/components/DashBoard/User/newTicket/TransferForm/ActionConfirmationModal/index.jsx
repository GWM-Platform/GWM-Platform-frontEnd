import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const ActionConfirmationModal = ({ TargetAccount, setShowModal, show, action, data, Balance, Transfer }) => {

    const { t } = useTranslation();

    const { AccountSelected } = useContext(DashBoardContext)
    const accountAlias = AccountSelected?.alias

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
                            {t("Operation")}:&nbsp;
                            <span className="emphasis">{t("Transfer")}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Transfer from")}:&nbsp;
                            <span className="emphasis">{accountAlias}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Transfer to")}:&nbsp;
                            <span className="emphasis">{TargetAccount?.content?.alias}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Transfer amount")}:&nbsp;
                            <FormattedNumber className="emphasis" prefix="U$D " value={data.amount.toString()} fixedDecimals={2} />
                        </li>
                    </ul>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                <Button variant="outline-secondary" onClick={() => handleClose()}>
                    {t("Cancel")}
                </Button>
                <Button disabled={Transfer.fetching} variant="outline-success" onClick={() => { action() }}>
                    <div className="iconContainer green">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default ActionConfirmationModal
