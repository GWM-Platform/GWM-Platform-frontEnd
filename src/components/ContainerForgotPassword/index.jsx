import React, { useState,useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { Col, Row, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'
import { urlContext } from '../../context/urlContext';

const ContainerForgotPassword = () => {
  // eslint-disable-next-line
  const { urlPrefix } = useContext(urlContext)

  const [data] = useState({});
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

  const handleChange = (event) => {
    data[event.target.id] = event.target.value
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setButtonDisabled(true)
    console.log("submit")
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>{t("Password Reset")}</h1>
                    <p className="text-medium-emphasis">{t(`Enter your user account's verified email address, your username and your birthdate. We will send you a password reset link.`)}</p>
                    <h2 className="error m-2">{error}</h2>
                    <h2 className="message m-2">{message}</h2>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </CInputGroupText>
                      <CFormControl
                        placeholder="Email"
                        autoComplete="email"
                        onChange={handleChange}
                        required
                        id="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faUser} />
                      </CInputGroupText>
                      <CFormControl
                        placeholder={t('Username')}
                        autoComplete="username"
                        id="username"
                        required
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-5">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faUser} />
                      </CInputGroupText>
                      <CFormControl
                        placeholder={t('Birthdate')}
                        autoComplete="date"
                        id="birthdate"
                        type="date"
                        required
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CButton color="danger" className="mainColor" type="submit" disabled={buttonDisabled}>
                      {t("Send password reset email")}
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContainerForgotPassword
