import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap'
import './index.css'
import MovementRow from './MovementRow';
import axios from 'axios'
import ShareTransferRow from './ShareTransferRow';

const DetailModal = ({ setShowModal, ShowModal, notification }) => {

    const handleClose = () => {
        setShowModal(false)
    }

    const [shareTransfer, setShareTransfer] = useState(null)
    useEffect(() => {
        if (notification.movement.shareTransferId && ShowModal && shareTransfer === null) {
            axios.get(`/share-transfers/${notification.movement.shareTransferId}`).then((response) => {
                setShareTransfer(response.data)
            }).catch(err => {
                console.log(err)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notification, ShowModal])

    return (
        notification.movement.shareTransferId ?
            (shareTransfer &&
                <Modal className="detailModal notification-detail" size="md" show={ShowModal} onHide={handleClose}>
                    <Modal.Body className="body">
                        <div>
                            <ShareTransferRow content={shareTransfer} />
                        </div>
                    </Modal.Body>
                </Modal >)
            :
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
