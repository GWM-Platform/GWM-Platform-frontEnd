import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from "context/DashBoardContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Client from './Client';
import './index.css'

const SelectClient = () => {
    const { UserClients, setIndexClientSelected } = useContext(DashBoardContext);
    const { t } = useTranslation()
    const [ClientToAccess, setClientToAccess] = useState(-1)

    const [remember, setRemember] = useState(false)

    const handleChange = (event) => {
        setRemember(event.target.checked)
    }

    const toDashBoard = () => {
        if (remember) {
            localStorage.setItem(UserClients.content[0].alias, ClientToAccess)
        }
        setIndexClientSelected(ClientToAccess)
    }

    return (
        <Container className="ClientSelector growAnimation">
            <Row className="min-100vh d-flex align-items-center justify-content-center" >
                <Col xs="11" sm="8" md="6" lg="5" xl="4">
                    <Card className="clientSelectorCard">
                        <Card.Body className="p-4">
                            <h1 className="header">
                                {t("Select an account")}
                            </h1>
                            <div>

                                {UserClients.content.map(
                                    (client, key) =>
                                        <Client disabled={client.enabled=== false} client={client} ownKey={key} key={key} ClientToAccess={ClientToAccess} setClientToAccess={setClientToAccess} />
                                )
                                }
                            </div>
                            <div className="w-100 mt-4 mt-2">
                                <Form.Check
                                    checked={remember}
                                    onChange={handleChange}
                                    type="checkbox"
                                    id="remember"
                                    label={t("Remember my choice")}
                                />
                            </div>
                            <div className="w-100 d-flex justify-content-end">
                                <Button className="mt-2 toDashBoard" onClick={() => toDashBoard()} disabled={ClientToAccess === -1} variant="danger" >
                                    {t("To DashBoard")}
                                    <FontAwesomeIcon className={`ms-2 chevron ${ClientToAccess !== -1 ? "show" : ""}`} icon={faChevronRight} />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SelectClient;