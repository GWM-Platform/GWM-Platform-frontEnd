import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const AddAccount = () => {
    const { t } = useTranslation();

    return (
        <Container className="notFound">
            <Row className="min-free-area d-flex justify-content-center">
                <Col sm="12" md="9">

                    <h1 className="pb-2">{t("Add Account")}</h1>
                    <Form>
                        <FloatingLabel
                            id="email"
                            label={t("Email")}
                            className="mb-3"
                        >
                            <Form.Control type="email" placeholder={t("Email")}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            id="username"
                            label={t("username")}
                            className="mb-3"
                        >
                            <Form.Control type="text" placeholder={t("username")}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            id="initialFounds"
                            label={t("Initial Founds")}
                            className="mb-3"
                        >
                            <Form.Control type="number" min="0" placeholder={t("Initial Founds")}
                            />
                        </FloatingLabel>
                        <Button variant="danger" type="submit">{t("Submit")}</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default AddAccount


