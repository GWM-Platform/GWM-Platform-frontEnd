import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Accordion, Badge, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useState } from 'react'

const User = ({ user }) => {

    const { t } = useTranslation()
    const [disabled, setDisabled] = useState(true)
    const toggledisabled = () => setDisabled(prevState => !prevState)



    return (
        <Accordion.Item className="user" eventKey={user.id}>
            <Accordion.Header>
                <div className="mb-0 pe-1 pe-md-2" >
                    <h1 className="title d-flex align-items-center">{t("User")}&nbsp;#{user.id}
                        {
                            !!(user.isOwner) &&
                            <>
                                &nbsp;
                                <Badge bg="primary">
                                    {t("Client owner")}
                                </Badge>
                            </>
                        }
                    </h1>
                    <h2 className="email">
                        {t("Email")}:&nbsp;
                        {user.email}
                    </h2>
                </div>
                <div className="ms-auto">
                </div>
            </Accordion.Header>
            <Accordion.Body>
                <Container className="px-0" fluid>
                    <Form>
                        <Row className='py-3'>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Comprar cuotapartes"
                                    disabled={disabled}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Vender cuotapartes"
                                    disabled={disabled}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Retirar dinero"
                                    disabled={disabled}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Transferir dinero"
                                    disabled={disabled}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Ver historial"
                                    disabled={disabled}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Ver tenencias"
                                    disabled={disabled}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Disabledar permisos"
                                    disabled={disabled}
                                />
                            </Col>
                        </Row>
                    </Form>
                    <Row className="justify-content-end gx-2">
                        {
                            disabled ?
                                <>
                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" onClick={() => toggledisabled()}>
                                            {t('Make owner')}
                                        </Button>
                                    </Col>
                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" onClick={() => toggledisabled()}>
                                            {t("Edit permissions")}
                                        </Button>
                                    </Col>
                                    <Col xs="auto" className=" mb-2">
                                        <Button disabled={user.isOwner} variant="danger">
                                            {t("Disconnect")}
                                        </Button>
                                    </Col>

                                </>
                                :
                                <>
                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" onClick={() => toggledisabled()}>
                                            {t("Cancelar")}
                                        </Button>
                                    </Col>
                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" onClick={() => toggledisabled()}>
                                            {t("Confirm")}
                                        </Button>
                                    </Col>
                                </>
                        }
                    </Row>
                </Container>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default User