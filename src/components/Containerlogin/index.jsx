  import React from 'react'
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
    CCardImage
  } from '@coreui/react'
  import './index.css';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faLock } from '@fortawesome/free-solid-svg-icons'
  import { faUser } from '@fortawesome/free-solid-svg-icons'
  import { useHistory } from 'react-router-dom';
  import { useTranslation } from "react-i18next";
  import { Col, Row, Container,Spinner } from 'react-bootstrap'
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
      <div className="bg-light">
        <Container fluid>
          <Row className="d-flex min-vh-100  justify-content-center align-items-center pt-3">
            <Col xs="12" sm="8" md="6" lg="5" xl="3">
              <CCardGroup>
                <CCard className="loginCard p-4">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                      <CCardImage className="mb-4" src={process.env.PUBLIC_URL + '/images/logo/logo.png'}></CCardImage>                      <h2 className="error">{t(error)}</h2>
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
                      <Row className="d-flex flex-row-reverse">
                        <Col xs="12">
                          <CInputGroup className="mb-0">
                            <CInputGroupText>
                              <FontAwesomeIcon icon={faLock} />
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
                        </Col>
                        <Col xs="12" className="text-right mb-4">
  
                          {/*<Form.Group controlId="formBasicCheckbox">
                            <Form.Check
                              type="checkbox"
                              id="remindme"
                              label={t("Keep me logged in")}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          */}
                          <CButton color="link" href="/forgotPassword" size="sm" className="forgot">
                            {t('Forgot Password?')}
                          </CButton>
                        </Col>
                      </Row>
                      <Row className="d-flex flex-row-reverse">
                        <Col xs="12">
                          <CButton type="submit" disabled={buttonDisabled} color="danger" className="mainColor button block px-4" /*onClick={toDashBoard}*/>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              style={{display:loading ?  "inline-block" : "none"}}
                            />{' '}
                            {t(buttonContent)}
                          </CButton>
                        </Col>
                      </Row>
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
  export default ContainerLogin