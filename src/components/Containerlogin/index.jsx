import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Col, Row, Container, Spinner, Card, Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import { useState } from 'react';

const ContainerLogin = () => {
  let history = useHistory();
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [data] = useState({ remindme: false });
  const [error, setError] = useState("");
  const [buttonContent, setButtonContent] = useState("Login");
  const [loading, setLoading] = useState(false);


  const toDashBoard = () => {
    history.push(`/dashboardNew/accounts`);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setButtonDisabled(true)
    setLoading(true)
    setButtonContent("Loading")
    if (data.username === "admin" && data.password === "1234") {
      toDashBoard();
      setError("")
    } else {
      console.table(data)
      setError("Sorry, the login failed! Please Try again")
      setButtonContent("Login")
      setButtonDisabled(false)
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    if (event.target.id === "remindme") {
      data[event.target.id] = event.target.checked
    } else {
      data[event.target.id] = event.target.value
    }
    setButtonDisabled(((data.password !== undefined && data.password !== "") && (data.username !== undefined && data.username !== "")) ? false : true)
  }

  return (
    <div className="login">
      <Container>
        <Row className="d-flex min-vh-100  justify-content-center align-items-center pt-3">
          <Col xs="12" sm="8" md="6" lg="4" xl="3">
            <Card className="loginCard">
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
                      autoComplete="username"
                      id="username"
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
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContainerLogin