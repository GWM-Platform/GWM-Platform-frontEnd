import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { fixedDepositTypes } from '../RuleSelector';
import TooltipInfo from 'components/DashBoard/Admin/Broadcast/TooltipInfo';

const ActionConfirmationModal = ({ setShowModal, show, action, data, Balance, fetching, anualRate, profit }) => {

    const { t } = useTranslation();

    const { ClientSelected } = useContext(DashBoardContext)

    const handleClose = () => {
        setShowModal(false)
    }
    const SelectedType = fixedDepositTypes.find(type => type.value === data.type)

    return (
        <Modal className="confirmationModal" size="auto" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div>
                    <h1 className="title"> {t("Ticket summary")} </h1>
                    <ul>
                        <li className="listedInfo">
                            {t("Account")}:&nbsp;
                            <span className="emphasis">{ClientSelected.alias}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Account balance")}:&nbsp;
                            <FormattedNumber className="emphasis" value={Balance} prefix="U$D " fixedDecimals={2} />
                        </li>
                        <li className="listedInfo">
                            {t("Product")}:&nbsp;
                            <span className="emphasis">{t("Time deposit")}</span>
                        </li>
                        <li className="listedInfo">
                            {t("Cash amount")}:&nbsp;
                            <FormattedNumber className="emphasis" value={data.amount} prefix="U$D " fixedDecimals={2} />
                        </li>
                        <li className="listedInfo">
                            {t("Anual rate")}:&nbsp;
                            <FormattedNumber className="emphasis" value={anualRate} suffix="%" fixedDecimals={2} />
                        </li>
                        {
                            SelectedType &&
                            <li>{t("Fixed deposit type")}: {t(SelectedType.label)}<TooltipInfo text={t(SelectedType.desc)} />
                            </li>
                        }
                        {
                            SelectedType?.resume &&
                            SelectedType?.resume({ data, t, anualRate })
                        }
                        <li className="listedInfo">
                            {t("Investment final amount after")}&nbsp;{data.days}&nbsp;{t("days")}:<span className="emphasis">&nbsp;
                                {
                                    profit.fetching ?
                                        <Spinner className="ms-2" animation="border" size="sm" />
                                        :
                                        <FormattedNumber className="emphasis" value={profit.value} prefix="U$D " fixedDecimals={2} />
                                }
                            </span>
                        </li>

                    </ul>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                <Button disabled={fetching} variant="outline-secondary" onClick={() => handleClose()}>
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
