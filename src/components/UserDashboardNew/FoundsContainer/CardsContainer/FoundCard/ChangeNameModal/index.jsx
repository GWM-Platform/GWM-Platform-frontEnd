import React from 'react'
import { Modal, Button,Form,FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChangeNameModal = ({ show, handleClose }) => {
    return (
        <Modal className="modal" show={show} onHide={handleClose}>
            <Modal.Header className="header">
                <Modal.Title className="title">Edit Name</Modal.Title>
            </Modal.Header>
            <Modal.Body className="body">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Name"
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="Name" />
                    <Form.Text className="help" >
                        The new account name must be 8-20 characters long,
                        and can only contain letters numbers and spaces
                    </Form.Text>
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer className="footer">
                <Button variant="outline-secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="outline-danger" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default ChangeNameModal