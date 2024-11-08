import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Container, Row, Col, Card, Form, InputGroup, Button, CardGroup } from 'react-bootstrap'
import { customFetch } from 'utils/customFetch';

const ContainerForgotPassword = () => {
  // eslint-disable-next-line

  // eslint-disable-next-line
  const [error, setError] = useState("")
  // eslint-disable-next-line
  const [message, setMessage] = useState("")
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const { t } = useTranslation();
  let history = useHistory();

  // eslint-disable-next-line 
  const toLogin = () => {
    history.push(`/login`);
  }

  const [formData, setFormData] = useState({})
  const [validated, setValidated] = useState(false);

  const handleChange = (event) => {
    let aux = formData;
    aux[event.target.id] = event.target.value;
    setFormData(aux);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      requestPasswordReset(formData)
    }
    setValidated(true);
  }

  const requestPasswordReset = async () => {
    setButtonDisabled(true)
    var url = `${process.env.REACT_APP_APIURL}/users/requestPasswordReset`;
    const response = await customFetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: "*/*",
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 201) {
      setMessage("We've sent you an email with a link to reset your password.")
      setButtonDisabled(false)
    } else {
      setButtonDisabled(false)
      switch (response.status) {
        case 500:
          setMessage("Error. Check the email entered")
          break;
        default:
          console.log(response.status)
          setMessage("unhandled Error")
      }
    }
  }

  return (
    <div className="forgotPassword min-vh-100 d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="5">
            <CardGroup>
              <Card className="p-4">
                <Card.Body>
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <h1>{t("Password Reset")}</h1>
                    <p className="text-medium-emphasis">{t(`Enter your user account's verified email address. We will send you a password reset link.`)}</p>
                    <h2 className="error m-2">{error}</h2>
                    <h2 className="message m-2">{t(message)}</h2>
                    <InputGroup className="mb-2">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Email"
                        autoComplete="email"
                        onChange={handleChange}
                        required
                        type="email"
                        id="email"
                      />
                    </InputGroup>
                    {/*
                      <InputGroup className="mb-2">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder={t('Username')}
                        autoComplete="username"
                        id="username"
                        required
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-5">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder={t('Birthdate')}
                        autoComplete="date"
                        id="birthdate"
                        type="date"
                        required
                        onChange={handleChange}
                      />
                    </InputGroup>*/
                    }

                    <Button variant="danger" className="button" type="submit" disabled={buttonDisabled}>
                      {t("Reset password")}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContainerForgotPassword
