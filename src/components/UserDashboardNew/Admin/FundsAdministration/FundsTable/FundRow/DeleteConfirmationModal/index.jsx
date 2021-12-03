import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faExclamation, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'


const DeleteConfirmationModal = ({ show, setShowModal, Fund, chargeFunds }) => {
    const { t } = useTranslation();

    const [Deleted, setDeleted] = useState(false)

    const handleClose = () => {
        chargeFunds()
        setShowModal(false)
    }

    const deleteFund = async () => {
        const url = `${process.env.REACT_APP_APIURL}/funds/${Fund.id}`;
        const token = sessionStorage.getItem("access_token")

        const response = await fetch(url, {
            method: 'delete',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            setDeleted(!Deleted)
        } else {
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Modal className="deleteModal" size="sm" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={Deleted ? "hidden" : "show"}>
                    <div className="descriptionIconContainer red mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faExclamation} /></h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to delete the fund")}{" \""}{Fund.name}{"\""}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
                <div className={Deleted ? "show" : "hidden"}>
                    <div className="descriptionIconContainer green mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faCheck} /></h1>
                    </div>
                    <h2 className="subTitle mt-4">{t("The fund")}{" \""}{Fund.name}{"\" "}{t("has been removed succesfully")}</h2>
                </div>
                <div className="placeHolder">
                    <div className="descriptionIconContainer red mx-auto">
                        <h1 className="title"><FontAwesomeIcon className="icon red" icon={faExclamation} /></h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to delete the fund")}{" "}{Fund.name}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    Deleted ?
                        <Button variant="outline-secondary" onClick={() => handleClose()}>
                            Close
                        </Button>
                        :
                        <>

                            <Button variant="outline-secondary" onClick={() => handleClose()}>
                                Cancel
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
