import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useState } from 'react'

const User = ({ user }) => {

    const { t } = useTranslation()
    const [edit, setEdit] = useState(true)
    const toggleedit = () => setEdit(prevState => !prevState)

    return (
        <Accordion.Item eventKey={user.id}>
            <Accordion.Header>{t("User")}: {user.email}</Accordion.Header>
            <Accordion.Body>
                <Container className="px-0" fluid>
                    <Form>
                        <Row className='py-3'>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Comprar cuotapartes"
                                    disabled={edit}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Vender cuotapartes"
                                    disabled={edit}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Retirar dinero"
                                    disabled={edit}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Transferir dinero"
                                    disabled={edit}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Ver historial"
                                    disabled={edit}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Ver tenencias"
                                    disabled={edit}
                                />
                            </Col>
                            <Col md="4">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Editar permisos"
                                    disabled={edit}
                                />
                            </Col>
                        </Row>
                    </Form>
                    <Row className="justify-content-end">
                        <Col xs="auto" className=" mb-2">
                            <Button variant="danger" onClick={() => toggleedit()}>
                                {
                                    edit ?
                                        t("Edit permissions")
                                        :
                                        t("Cancelar")
                                }
                            </Button>
                        </Col>
                        <Col xs="auto" className=" mb-2">
                            <Button variant="danger">
                                {
                                    edit ?
                                        t("Revoke access")
                                        :
                                        t("Confirm")
                                }
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default User