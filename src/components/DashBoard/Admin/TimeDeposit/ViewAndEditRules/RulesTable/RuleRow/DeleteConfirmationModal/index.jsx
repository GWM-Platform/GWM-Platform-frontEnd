import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faExclamation, faCheck,faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'


const DeleteConfirmationModal = ({ show, setShowModal}) => {
    const { t } = useTranslation();

    const [DeleteFetch, setDeleteFetch] = useState({ fetched: false, fetching: false, valid: false })

    const handleClose = () => {
        setDeleteFetch({
            ...DeleteFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setShowModal(false)
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

    const deleteFund = async () => {
        setDeleteFetch({
            ...DeleteFetch,
            fetching: true,
            fetched: false,
            valid: false
        })

        if (true) {
            setDeleteFetch({
                ...DeleteFetch,
                fetching: false,
                fetched: true,
                valid: true
            })
        } else {
            setDeleteFetch({
                ...DeleteFetch,
                fetching: false,
                fetched: true,
                valid: false
            })
        }
    }

    return (
        <Modal className="deleteModal" size="sm" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={!DeleteFetch.fetched && !DeleteFetch.fetching ? "show" : "hidden"}>
                    <div className="descriptionIconContainer red mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faExclamation} /></h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to delete the rule")}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
                <div className={DeleteFetch.fetched && !DeleteFetch.fetching ? "show" : "hidden"}>
                    {
                        DeleteFetch.valid ?
                            <>
                                <div className="descriptionIconContainer green mx-auto">
                                    <h1 className="title"><FontAwesomeIcon className="icon green" icon={faCheck} /></h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("The rule")}&nbsp;{t("has been removed succesfully")}</h2>
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
                    <h2 className="subTitle">{t("You are about to delete the rule")}</h2>
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
                            <Button variant="outline-danger" onClick={() => { deleteFund() }}>
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
