import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './index.css'

const OperationStatus = ({setItemSelected}) => {
    useEffect(() => {
        setItemSelected("")
    }, [setItemSelected])
    return (
        <Container className="OperationStatus">
            <Row className="min-free-area-total d-flex align-items-center justify-content-center">
                <Col sm="auto">
                    <h1 className="statusIcon"><FontAwesomeIcon icon={faCheckCircle}/></h1>
                    <h1  className="message">Transaction done successfully</h1>
                </Col>
            </Row>
        </Container>
    )
}
export default OperationStatus