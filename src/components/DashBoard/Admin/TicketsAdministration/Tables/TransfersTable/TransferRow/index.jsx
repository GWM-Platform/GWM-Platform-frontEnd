import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useTranslation } from 'react-i18next';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const TransferRow = ({ Movement, reloadData, anyWithActions }) => {
    const { t } = useTranslation();

    var momentDate = moment(Movement.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const status = () => {
        switch (Movement.stateId) {
            case 1://pending
                return {
                    bg: "info",
                    text: "Pending"
                }
            case 2://Approved
                return {
                    bg: "success",
                    text: "Approved"
                }
            case 3://Denied
                return {
                    bg: "danger",
                    text: "Denied"
                }
            case 4://Liquidated
                return {
                    bg: "primary",
                    text: "Liquidated"
                }
            case 5://Client pending
                return {
                    bg: "warning",
                    text: "Client pending"
                }
            case 6://Client pending
                return {
                    bg: "warning",
                    text: "Admin sign pending"
                }
            default:
                return {
                    bg: "danger",
                    text: "Denied"
                }
        }
    }

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    const [showClick, setShowClick] = useState(false)
    const [showHover, setShowHover] = useState(false)


    const transferNote = Movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
    const clientNote = Movement?.notes?.find(note => note.noteType === "CLIENT_NOTE")
    const denialMotive = Movement?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
    const adminNote = Movement?.notes?.find(note => note.noteType === "ADMIN_NOTE")

    return (
        <>
            <div className='mobileMovement'>
                <div className='d-flex py-1 align-items-center' >
                    <span className="h5 mb-0 me-1 me-md-2">{t("Transfer")}&nbsp;#{Movement.id}</span>
                    <div className='me-auto px-1 px-md-2' style={{ borderLeft: "1px solid lightgray", borderRight: "1px solid lightgray" }}>
                        <span className="d-none d-md-inline">{t("Client")}:&nbsp;</span>
                        {
                            Movement?.senderAlias
                                ?
                                Movement?.senderAlias

                                :
                                t("Undefined Client")
                        }
                    </div>
                    {
                        !!(Movement.stateId === 2 && !Movement.reverted && moment().diff(moment(Movement.createdAt), 'days') < 30) &&
                        <div className="h-100 d-flex align-items-center justify-content-around Actions">
                            <div className="iconContainer red me-1">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("revert") }} />
                            </div>

                        </div>
                    }
                    {
                        (Movement.reverted && transferNote?.text !== "Transferencia revertida") &&
                        <Badge className='ms-1 ms-md-2' bg="info">{t("Reverted")}</Badge>
                    }
                    <Badge className='ms-1 ms-md-2' bg={status()?.bg}>{t(status().text)}</Badge>
                    {
                        !!(Movement?.userEmail || Movement?.userName || !!(transferNote) || !!(clientNote) || !!(denialMotive) || !!(adminNote)) &&
                        <div>
                            <OverlayTrigger
                                show={showClick || showHover}
                                placement="auto"
                                delay={{ show: 250, hide: 400 }}
                                popperConfig={{
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 0],
                                            },
                                        },
                                    ],
                                }}
                                overlay={
                                    <Tooltip className="mailTooltip" id="more-units-tooltip">
                                        {!!(Movement.userEmail || Movement.userName) &&
                                            <div>
                                                {t('Operation performed by')}:<br />
                                                <span className="text-nowrap">{Movement?.userName || Movement.userEmail}</span>
                                            </div>
                                        }
                                        {!!(transferNote) &&
                                            <div>
                                                {t('Transfer note')}:<br />
                                                <span className="text-nowrap">"{transferNote.text}"</span>
                                            </div>
                                        }
                                        {!!(clientNote) &&
                                            <div>
                                                {t('Personal note')}:<br />
                                                <span className="text-nowrap">"{clientNote.text}"</span>
                                            </div>
                                        }
                                        {!!(denialMotive) &&
                                            <div>
                                                {t('Denial motive')}:<br />
                                                <span className="text-nowrap">"{denialMotive.text}"</span>
                                            </div>
                                        }
                                        {!!(adminNote) &&
                                            <div>
                                                {t('Admin note')}:<br />
                                                <span className="text-nowrap">"{adminNote.text}"</span>
                                            </div>
                                        }
                                    </Tooltip>
                                }
                            >
                                <span>
                                    <button
                                        onBlur={() => setShowClick(false)}
                                        onClick={() => setShowClick(prevState => !prevState)}
                                        onMouseEnter={() => setShowHover(true)}
                                        onMouseLeave={() => setShowHover(false)}
                                        type="button" className="noStyle"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    }
                </div >

                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        <span className="d-inline d-md-none">{t("Sender")}</span>
                        <span className="d-none d-md-inline">{t("Source account")}</span>
                        :&nbsp;
                        {
                            Movement?.senderAlias
                        }
                    </span>
                </div >

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        <span className="d-inline d-md-none">{t("Receiver")}</span>
                        <span className="d-none d-md-inline">{t("Target account")}</span>
                        :&nbsp;
                        {
                            Movement?.receiverAlias
                        }
                    </span>
                </div >
                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Amount")}:&nbsp;
                        <FormattedNumber value={Movement.amount} prefix="U$D " fixedDecimals={2} />
                    </span>
                </div >

                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        <span className="d-inline d-md-none">{t("Date")}</span>
                        <span className="d-none d-md-inline">{t("Created at")}</span>:&nbsp;
                        {momentDate.format('L')}
                    </span>
                </div >
            </div >
            {
                !!(Movement.stateId === 2) &&
                <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
            }
        </>
    )
}
export default TransferRow

