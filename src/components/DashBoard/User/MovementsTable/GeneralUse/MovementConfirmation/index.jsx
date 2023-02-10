import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const MovementConfirmation = ({ movement, setShowModal, action, show, reloadData }) => {
    const { t } = useTranslation();
    const [ActionFetch, setActionFetch] = useState({ fetched: false, fetching: false, valid: false })

    const handleClose = () => {
        setActionFetch({
            ...ActionFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setShowModal(false)
    }


    const changeMovementState = async () => {
        setActionFetch({
            ...ActionFetch,
            fetching: true,
            fetched: false,
            valid: false
        })


        axios.post(action === "approve" ? `/movements/${movement.id}/clientCheck` : `/movements/${movement.id}/clientDeny`)
            .then(function (response) {
                setActionFetch({
                    ...ActionFetch,
                    fetching: false,
                    fetched: true,
                    valid: true
                })
            })
            .catch((err) => {
                setActionFetch({
                    ...ActionFetch,
                    fetching: false,
                    fetched: true,
                    valid: false
                })
            });
    }

    const Content = () => (
        <>
            <div className="d-flex justify-content-center align-items-center">
                <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                    <FontAwesomeIcon
                        className="p-absolute"
                        color="red"
                        icon={faExclamation}
                        style={{
                            transform: "translate(-50%, -50%)",
                            top: "50%",
                            left: "50%"
                        }}
                    />
                    <FontAwesomeIcon

                        color="red"
                        icon={faCircle}
                        className="p-absolute"
                        style={{
                            transform: "translate(-50%, -50%) scale(1.5)",
                            top: "50%",
                            left: "50%"
                        }}
                    />
                    <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                </h1>
            </div>
            <h1 className="title"> {t("Are you sure?")}</h1>
            <h2 className="subTitle">{t("You are about to")} {t(action)} {t("the movement #")}{movement.id}</h2>
            <ul>
                <li className="listedInfo">
                    {t("Operation")}:&nbsp;
                    <strong className="emphasis">
                        {t(movement.motive + (movement.motive === "REPAYMENT" ? movement.fundName ? "_" + movement.fundName : "_" + movement.fixedDepositId : ""), { fund: movement.fundName, fixedDeposit: movement.fixedDepositId })}
                    </strong>
                </li>
                <li className="listedInfo">
                    {t("Amount")}:&nbsp;
                    <strong className="emphasis">
                        <FormattedNumber value={Math.abs(movement.amount)} prefix="$" fixedDecimals={2} />
                    </strong>
                </li>
                <li className="listedInfo">
                    {t('Performed by')}: <strong className="emphasis text-nowrap">{movement?.userEmail}</strong>
                </li>
            </ul>
            <h3 className="heading">{t("This action cannot be undone")}</h3>
        </>
    )

    return (
        <Modal className="deleteModal" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={!ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    <Content />
                </div>
                <div className={ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    {
                        ActionFetch.valid ?
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="green"
                                            icon={faCheck}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="green"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("The ticket has been")} {t(action === "approve" ? "approved" : "denied")} {t("succesfully")}</h2>
                            </>
                            :
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="red"
                                            icon={faTimes}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="red"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("Failed to")}{" "}{t(action)}{" "}{t("the ticket")}</h2>
                            </>
                    }

                </div>
                <div className="placeHolder">
                    <Content />
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    ActionFetch.fetched ?
                        <Button variant="outline-secondary" onClick={() => { reloadData(); handleClose() }}>
                            {t("Close")}
                        </Button>
                        :
                        <>

                            <Button variant="outline-secondary" onClick={() => handleClose()}>
                                {t("Cancel")}
                            </Button>
                            <Button variant="outline-success" onClick={() => { if (!ActionFetch.fetching) changeMovementState() }}>
                                <div className="iconContainer green">
                                    {t("Confirm")}
                                </div>
                            </Button>
                        </>
                }

            </Modal.Footer>
        </Modal>
    )
}
export default MovementConfirmation
