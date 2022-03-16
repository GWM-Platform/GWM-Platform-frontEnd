import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './operationsForm.css'
import './index.css'

import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next';

const OperationStatus = ({setItemSelected,NavInfoToggled}) => {

    const {t} = useTranslation()
    useEffect(() => {
        setItemSelected("")
    }, [setItemSelected])
    return (
        <Container className="OperationStatus h-100 growAnimation">
            <Row className={`h-100 d-flex align-items-center justify-content-center`}>
                <Col sm="auto">
                    <h1 className="statusIcon"><FontAwesomeIcon icon={faCheckCircle}/></h1>
                    <h1  className="title">{t("Deposit done successfully")}</h1>
                </Col>
            </Row>
        </Container>
    )
}
export default OperationStatus