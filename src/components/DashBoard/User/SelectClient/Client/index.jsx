import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

const Client = ({ client, ClientToAccess, setClientToAccess, ownKey, disabled }) => {
    const { t } = useTranslation()
    return (
        <Container fluid style={disabled ? { opacity: 0.7, pointerEvents: "none" } : null} className={`px-0 client ${ClientToAccess === ownKey ? "selected" : ""}`} onClick={() => setClientToAccess(ownKey)}>
            <Row className="mx-0 w-100">
                <Col xs="auto" className="d-flex align-items-center">
                    <FontAwesomeIcon className={`userIcon  ${ClientToAccess === ownKey ? "selected" : ""}`} icon={faUserCheck} />
                    <FontAwesomeIcon className={`userIcon ${ClientToAccess === ownKey ? "" : "selected"}`} icon={faUser} />
                    <FontAwesomeIcon className="userIcon placeholder" icon={faUserCheck} />
                </Col>
                <Col className="ps-0">
                    <h2 className='names'>{client.firstName} {disabled && `(${t("Disabled")})`}</h2>
                    <h3 className='alias'>{client.lastName}</h3>
                </Col>
            </Row>
        </Container>
    );
}

export default Client;