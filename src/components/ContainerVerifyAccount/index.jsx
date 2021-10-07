import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, FloatingLabel,Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const ContainerVerifyAccount = () => {
    const { t } = useTranslation();
    const { user, token } = useParams();

    return (
        <Container className="notFound">
            <Row className="min-free-area d-flex justify-content-center align-items-center">
                <Col sm="12" md="10" lg="6" xl="5">
                    <Card className="px-2 pb-4">
                        <Card.Body>
                            <h1 className="pb-2">{t("Verify Account")}</h1>
                            <Form>
                                <FloatingLabel
                                    id="token"
                                    label={t("Token")}
                                    className="mb-3"
                                >
                                    <Form.Control defaultValue={token} type="text" placeholder={t("Token")} />
                                </FloatingLabel>
                                <FloatingLabel
                                    id="username"
                                    label={t("username")}
                                    className="mb-3"
                                >
                                    <Form.Control defaultValue={user} type="text" placeholder={t("username")} />
                                </FloatingLabel>
                                <FloatingLabel
                                    id="name"
                                    label={t("name")}
                                    className="mb-3 capitalize"
                                >
                                    <Form.Control className="capitalize" defaultValue={user} type="text" placeholder={t("name")}/>
                                </FloatingLabel>
                                <FloatingLabel
                                    id="surname"
                                    label={t("surname")}
                                    className="mb-3 capitalize"
                                >
                                    <Form.Control className="capitalize" defaultValue={user} type="text" placeholder={t("surname")} />
                                </FloatingLabel>
                                
                                <FloatingLabel
                                    id="password"
                                    label={t("Password")}
                                    className="mb-3"
                                >
                                    <Form.Control type="password" placeholder={t("Password")}
                                    />
                                </FloatingLabel>
                                <FloatingLabel
                                    id="confirmPassword"
                                    label={t("Confirm password")}
                                    className="mb-3"
                                >
                                    <Form.Control type="password" placeholder={t("Token")}
                                    />
                                </FloatingLabel>
                                <Button variant="danger" type="submit">{t("Submit")}</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
export default ContainerVerifyAccount
