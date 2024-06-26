import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { fetchFundHistory } from 'Slices/DashboardUtilities/fundHistorySlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const ActionConfirmationModal = ({ setShowModal, show, id, sharePrice, cancel }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
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

    const changeTransactionState = async () => {
        setActionFetch({
            ...ActionFetch,
            fetching: true,
            fetched: false,
            valid: false
        })

        axios.put(`/fundHistory/${id}`, { sharePrice })
            .then(() => {
                setActionFetch({
                    ...ActionFetch,
                    fetching: false,
                    fetched: true,
                    valid: true
                })
            }
            ).catch(() => {
                setActionFetch({
                    ...ActionFetch,
                    fetching: false,
                    fetched: true,
                    valid: false
                })
            })
    }


    return (
        <Modal
            className="deleteModal" size="sm" show={show}
            onHide={() => {
                if (!ActionFetch.fetching) {
                    if (!ActionFetch.fetched) {
                        cancel()
                    }else{
                        dispatch(fetchFundHistory())
                    }
                    handleClose()
                }
            }}
        >
            <Modal.Body className="body">
                <div className={`action-status ${ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}`}>
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
                                <h2 className="subTitle mt-4">{t("The historic price has been edited succesfully")}</h2>
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
                                <h2 className="subTitle mt-4">{t("Failed to edit the historic price")}</h2>
                            </>
                    }
                </div>
                <div className={`esqueleton ${!ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}`}>
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
                    <h2 className="subTitle">{t("You are about to edit an historic price")}</h2>
                    <h3 className="heading">{t("This action will change results of performance calculations and cannot be undone")}</h3>
                </div>

            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    ActionFetch.fetched ?
                        <Button variant="outline-secondary" onClick={() => { dispatch(fetchFundHistory()); handleClose() }}>
                            {t("Close")}
                        </Button>
                        :
                        <>

                            <Button variant="outline-secondary" onClick={() => { cancel(); handleClose() }}>
                                {t("Cancel")}
                            </Button>
                            <Button variant="outline-success" onClick={() => { if (!ActionFetch.fetching) changeTransactionState() }}>
                                <div className="iconContainer green">
                                    {t("Confirm")}
                                </div>
                            </Button>
                        </>
                }

            </Modal.Footer>
        </Modal >
    )
}
export default ActionConfirmationModal
