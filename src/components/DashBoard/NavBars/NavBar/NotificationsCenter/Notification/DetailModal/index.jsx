import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap'
import './index.css'
import MovementRow from './MovementRow';

const DetailModal = ({ setShowModal, ShowModal, notification }) => {

    const handleClose = () => {
        setShowModal(false)
    }

    return (
        <Modal className="detailModal notification-detail" size="md" show={ShowModal} onHide={handleClose}>
            <Modal.Body className="body">
                <div>
                    {
                        !!(notification.movement) &&
                        <MovementRow Movement={notification.movement} />
                    }
                </div>
            </Modal.Body>
        </Modal >
    )
}
export default DetailModal
