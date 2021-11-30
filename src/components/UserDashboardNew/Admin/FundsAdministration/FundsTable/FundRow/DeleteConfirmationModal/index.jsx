import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Modal, Button } from 'react-bootstrap'


const DeleteConfirmationModal = ({ show, handleClose, Fund }) => {
    const { t } = useTranslation();

    return (
        <Modal className="deleteModal" show={show} onHide={handleClose}>
            <Modal.Header className="header">
                <Modal.Title className="title">{t("Fund delete confirmation")}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="body">
                {t("You are about to delete the fund")+ " \""+Fund.name+"\" "+ t("Are you sure?")}
            </Modal.Body>
            <Modal.Footer className="footer">
                <Button variant="outline-secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="outline-danger" onClick={handleClose}>
                    <div className="iconContainer red">
                        <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                    </div>
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default DeleteConfirmationModal
