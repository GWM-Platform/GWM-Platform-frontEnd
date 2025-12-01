import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next';
import { customFetch } from 'utils/customFetch';

const DeleteConfirmationModal = ({ show, setShowModal, Note, chargeNotes }) => {
    const { t } = useTranslation();
    const [DeleteRequest, setDeleteRequest] = useState({ fetched: false, fetching: false, valid: false })

    const handleClose = () => {
        setDeleteRequest({ fetched: false, fetching: false, valid: false })
        setShowModal(false)
    }

    const deleteNote = async () => {
        setDeleteRequest({
            ...DeleteRequest,
            fetching: true,
            fetched: false,
            valid: false
        })

        const url = `${process.env.REACT_APP_APIURL}/liquidation-notes/${Note.id}`;
        const token = sessionStorage.getItem("access_token")

        const response = await customFetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200 || response.status === 204) {
            setDeleteRequest({
                ...DeleteRequest,
                fetching: false,
                fetched: true,
                valid: true
            })
        } else {
            setDeleteRequest({
                ...DeleteRequest,
                fetching: false,
                fetched: true,
                valid: false
            })
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Modal className="deleteModal" size="sm" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={`action-status ${DeleteRequest.fetched && !DeleteRequest.fetching ? "show" : "hidden"}`}>
                    {
                        DeleteRequest.valid ?
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
                                <h2 className="subTitle mt-4">{t("The liquidation option has been deleted successfully")}</h2>
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
                                <h2 className="subTitle mt-4">{t("Failed to delete the liquidation option")}</h2>
                            </>
                    }
                </div>
                <div className={`esqueleton ${!DeleteRequest.fetched && !DeleteRequest.fetching ? "show" : "hidden"}`}>
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
                    <h1 className="title">{t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to delete the liquidation option")} "{Note.nombre}"</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    DeleteRequest.fetched ?
                        <Button variant="outline-secondary" onClick={() => { chargeNotes(); handleClose() }}>
                            {t("Close")}
                        </Button>
                        :
                        <>
                            <Button variant="outline-secondary" onClick={() => handleClose()}>
                                {t("Cancel")}
                            </Button>
                            <Button 
                                disabled={DeleteRequest.fetching} 
                                variant="outline-danger" 
                                onClick={() => { if (!DeleteRequest.fetching) deleteNote() }}
                            >
                                {t("Delete")}
                            </Button>
                        </>
                }
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmationModal

