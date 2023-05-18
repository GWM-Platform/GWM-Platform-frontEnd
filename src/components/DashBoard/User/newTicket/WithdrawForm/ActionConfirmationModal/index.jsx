import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

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
                            {t("Account with whom the operation will be made")}: <span className="emphasis">{ClientSelected.alias}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Cash balance")}: <FormattedNumber className="emphasis" prefix="U$D " value={Balance.toString()} fixedDecimals={2} />
                        </li>
                        <li className="listedInfo">
                            {t("Withdrawing")}: <FormattedNumber className="emphasis" prefix="U$D " value={data.amount.toString()} fixedDecimals={2} />
                        </li>
                        {
                            data.note !== "" &&
                            <li className="listedInfo">
                                {t("Transfer note")}:&nbsp;
                                <span className="emphasis">{data?.note}</span>
                            </li>
                        }
                    </ul>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                <Button disabled={fetching} variant="outline-secondary" onClick={() => handleClose()}>
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
