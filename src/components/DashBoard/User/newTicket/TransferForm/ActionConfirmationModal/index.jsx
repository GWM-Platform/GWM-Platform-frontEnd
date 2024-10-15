import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const ActionConfirmationModal = ({ TargetAccount, setShowModal, show, action, data, Balance, Transfer, share_transfer, fund_selected, usdValue }) => {

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
                        {
                            share_transfer &&
                            <li className="listedInfo">
                                {t("Fund")}:&nbsp;
                                <span className="emphasis">{fund_selected?.fund?.name}</span>
                            </li>
                        }
                        <li className="listedInfo">
                            {t("Transfer to")}:&nbsp;
                            <span className="emphasis">{TargetAccount?.content?.alias}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Transfer amount")}:&nbsp;
                            <FormattedNumber className="emphasis" prefix={share_transfer ? "" : "U$D "} value={data.amount.toString()} fixedDecimals={2} />
                            {share_transfer && <span className='emphasis'>&nbsp;{data.amount === 1 || data.amount === "1" ? t("share") : t("shares")}</span>}
                            {share_transfer && <>&nbsp;(<FormattedNumber className="emphasis" prefix={"U$D "} value={usdValue} fixedDecimals={2} />)</>}
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
                <Button disabled={Transfer.fetching} variant="outline-secondary" onClick={() => handleClose()}>
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
