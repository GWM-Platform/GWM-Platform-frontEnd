import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Col, Row, Spinner, Card, Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const FormDesktop = ({ handleChange, handleSubmit, buttonDisabled, error, buttonContent, setButtonContent, loading, setLoading, data, setData }) => {

    const { t } = useTranslation();

    return (
        <Card className="loginCard d-none d-lg-block">
            <Form onSubmit={handleSubmit}>
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-center">
                        <Card.Img className="mb-4" src={process.env.PUBLIC_URL + '/images/logo/logo.png'} />
                    </div>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">
                            <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                        <FormControl
                            placeholder={t('Username or Email')}
                            autoComplete="email"
                            id="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                            type="email"
                        />
                    </InputGroup>
                    <Row className="d-flex flex-row-reverse">
                        <Col xs="12">
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faLock} />
                                </InputGroup.Text>
                                <FormControl
                                    type="password"
                                    placeholder={t('Password')}
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    id="password"
                                    required
                                />
                            </InputGroup>
                        </Col>
                        <Col xs="12" className="text-right">
                            <h2 className="error">{t(error)}</h2>
                            <Button variant="link" size="sm" className="forgot" href="/forgotPassword">{t('Forgot Password?')}</Button>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <Button type="submit" disabled={buttonDisabled} variant="danger" className="mainColor button block px-4 py-2">
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ display: loading ? "inline-block" : "none" }}
                        />{' '}
                        {t(buttonContent)}
                    </Button>
                </Card.Footer>
            </Form>
        </Card>
    )
}
export default FormDesktop