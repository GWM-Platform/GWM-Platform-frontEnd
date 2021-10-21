import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Col, Row, Spinner, Card, Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const FormMobile = ({ handleChange, handleSubmit, buttonDisabled, setButtonDisabled, error, setError, buttonContent, setButtonContent, loading, setLoading, data, setData }) => {
    const { t } = useTranslation();

    return (
        <Form onSubmit={handleSubmit} className="d-block d-lg-none mobile">
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
                    id="email1"
                    value={data.email}
                    onChange={handleChange}
                    required
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
                            id="password2"
                            value={data.password}
                            required
                        />
                    </InputGroup>
                </Col>
                <Col xs="12" className="text-right">
                    <h2 className="error">{t(error)}</h2>
                    <Button variant="link" size="sm" className="forgot" href="/forgotPassword">{t('Forgot Password?')}</Button>
                </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Check
                    id="api1"
                    value={data.api}
                    onChange={handleChange}
                    type="checkbox"
                    label="¿Deseas Logearte con la api?" />
            </Form.Group>
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
        </Form>
    )
}
export default FormMobile