import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';


const DeleteConfirmationModal = ({ show, setShowModal, rule, TimeDeposit ,getFixedDepositPlans}) => {
    
    const { t } = useTranslation();

    const { toLogin } = useContext(DashBoardContext)

    const [DeleteFetch, setDeleteFetch] = useState({ fetched: false, fetching: false, valid: false })

    const handleClose = () => {
        setDeleteFetch({
            ...DeleteFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setShowModal(false)
        getFixedDepositPlans()
    }

    const closeModalWithoutReloading = () => {
        setDeleteFetch({
            ...DeleteFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setShowModal(false)
    }

    const deleteRule = () => {
        setDeleteFetch({
            ...DeleteFetch,
            fetching: true,
            fetched: false,
            valid: false
        })
    
        let TimeDepositEdited = { ...TimeDeposit }
        delete TimeDepositEdited.interest[rule]
        axios.put(`/fixed-deposits/plans/${TimeDeposit?.id}`, TimeDepositEdited).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setDeleteFetch({
                    ...DeleteFetch,
                    fetching: false,
                    fetched: true,
                    valid: true
                })
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setDeleteFetch({
                            ...DeleteFetch,
                            fetching: false,
                            fetched: true,
                            valid: false
                        })
                        break;
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setDeleteFetch({
                    ...DeleteFetch,
                    fetching: false,
                    fetched: true,
                    valid: false
                })
            }
        });
    }

    return (
        <Modal className="deleteModal" size="sm" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={!DeleteFetch.fetched && !DeleteFetch.fetching ? "show" : "hidden"}>
                    <div className="descriptionIconContainer red mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faExclamation} /></h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to delete the rule for")}&nbsp;{rule}&nbsp;{t("days")}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
                <div className={DeleteFetch.fetched && !DeleteFetch.fetching ? "show" : "hidden"}>
                    {
                        DeleteFetch.valid ?
                            <>
                                <div className="descriptionIconContainer green mx-auto">
                                    <h1 className="title"><FontAwesomeIcon className="icon green" icon={faCheck} /></h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("The rule has been removed succesfully")}</h2>
                            </>
                            :
                            <>
                                <div className="descriptionIconContainer red mx-auto">
                                    <h1 className="title"><FontAwesomeIcon className="icon red" icon={faTimes} /></h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("Failed to delete the rule")}</h2>
                            </>
                    }

                </div>
                <div className="placeHolder">
                    <div className="descriptionIconContainer red mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faExclamation} /></h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to delete the rule for")}&nbsp;{rule}&nbsp;{t("days")}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    DeleteFetch.fetched ?
                        <Button variant="outline-secondary" onClick={() => handleClose()}>
                            Close
                        </Button>
                        :
                        <>

                            <Button variant="outline-secondary" onClick={() => closeModalWithoutReloading()}>
                                {t("Cancel")}
                            </Button>
                            <Button variant="outline-danger" onClick={() => { deleteRule() }}>
                                <div className="iconContainer red">
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </div>
                            </Button>
                        </>
                }

            </Modal.Footer>
        </Modal>
    )
}
export default DeleteConfirmationModal
