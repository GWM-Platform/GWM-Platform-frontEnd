import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'


const DeleteConfirmationModal = ({ show, handleClose, Fund,chargeFunds }) => {
    const { t } = useTranslation();

    const deleteFund = async () => {
        const url = `${process.env.REACT_APP_APIURL}/funds/${Fund.id}`;
        const token=sessionStorage.getItem("access_token")

        const response = await fetch(url, {
            method: 'delete',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            chargeFunds()
        } else {
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Modal className="deleteModal" show={show} onHide={handleClose}>
            <Modal.Header className="header">
                <Modal.Title className="title">{t("Fund delete confirmation")}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="body">
                {t("You are about to delete the fund")+ " \""+Fund.name+"\" "+ t("Are you sure?")}
            </Modal.Body>
            <Modal.Footer className="footer">
                <Button variant="outline-secondary" onClick={()=>handleClose}>
                    Cancel
                </Button>
                <Button variant="outline-danger" onClick={()=>{deleteFund();handleClose()}}>
                    <div className="iconContainer red">
                        <FontAwesomeIcon className="icon" icon={faTrashAlt}/>
                    </div>
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default DeleteConfirmationModal
