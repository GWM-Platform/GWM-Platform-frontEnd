import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Col, Row, Container, Spinner, Button } from 'react-bootstrap'
import { useState } from 'react';
import { urlContext } from '../../context/urlContext';

const ContainerLogin = () => {
  const { urlPrefix } = useContext(urlContext)

  let history = useHistory();
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [data] = useState({});
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
    if (data.username==="admin" && data.password==="1234") {
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

    <Container fluid className="login">
      <Row className="d-flex min-vh-100 align-items-center justify-content-center">
        <Row className="d-flex flex-row-reverse align-items-end reduced">
          <Col md="12" lg="6" xl="5">
            <Row className="d-flex justify-content-center">
              <Col sm="8" md="5" lg="12">
                <img className="image" alt="GMW Platform" src="/images/logo-798x1000.png" />
              </Col>
            </Row>
          </Col>
          <Col md="12" lg="6" xl="6">
            <Row className="d-flex justify-content-center">
              <Col sm="12" md="10" xl="8">
                <CForm onSubmit={handleSubmit}>
                  <h2 className="error">{t(error)}</h2>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                    <CFormControl
                      placeholder={t('Username or Email')}
                      autoComplete="username"
                      id="username"
                      onChange={handleChange}
                      required />
                  </CInputGroup>
                  <CInputGroup className="mb-5">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faLock} color="yellow" />
                    </CInputGroupText>
                    <CFormControl
                      type="password"
                      placeholder={t('Password')}
                      autoComplete="current-password"
                      onChange={handleChange}
                      id="password"
                      required
                    />
                  </CInputGroup>
                  <Button type="submit" disabled={buttonDisabled} variant="outline-light" className="block px-4 button">
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
                  <Button color="link" href="/forgotPassword" size="lg" className="forgotPass block">
                    {t('Forgot Password?')}
                  </Button>
                </CForm>
              </Col>
            </Row>
          </Col >

        </Row>
      </Row>
    </Container>
  )
}
export default ContainerLogin
