import React, { useContext, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
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
  CFormText
} from '@coreui/react'
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { Col, Row, Container, Form } from 'react-bootstrap'
import { urlContext } from '../../context/urlContext';

const ContainerForgotPassword = () => {
  const { t } = useTranslation();
  let history = useHistory();
  
  // eslint-disable-next-line 
  const { urlPrefix } = useContext(urlContext)

  const { user, token } = useParams();
  const [data] = useState({})
  const [toAPI] = useState({
    token: token,
    username: user
  })

  // eslint-disable-next-line 
    const toLogin = () => {
    history.push(`/login`);
  }

  data.token = token
  data.username = user

  const [buttonStatus, setbuttonStatus] = useState(true)
  // eslint-disable-next-line
  const [error, setError] = useState("")


  const [validation] = useState({})
  const [validationFlag, setValidationFlag] = useState(false)
  const [match, setMatch] = useState("block")
  const [checkLenght, setCheckLenght] = useState("none")
  const [uncheckLenght, setunCheckLenght] = useState("")
  const [checkNumber, setCheckNumber] = useState("none")
  const [uncheckNumber, setunCheckNumber] = useState("")
  const [checkSymbol, setCheckSymbol] = useState("none")
  const [uncheckSymbol, setunCheckSymbol] = useState("")
  const [checkCapital, setCheckCapital] = useState("none")
  const [uncheckCapital, setunCheckCapital] = useState("")
  const [checkLowercase, setCheckLowercase] = useState("none")
  const [uncheckLowercase, setunCheckLowercase] = useState("")

  const handleChange = (event) => {    
    if (event.target.id !== "passwordConfirm") {
      toAPI[event.target.id] = event.target.value
    }

    data[event.target.id] = event.target.value

    if (event.target.id === "password") {
      //Validate lenght
      if (event.target.value.length >= 8) {
        validation.lenght = true
        setCheckLenght("")
        setunCheckLenght("none")

      } else {
        validation.lenght = false
        setCheckLenght("none")
        setunCheckLenght("")

      }
      //Validate lowecase letters
      if (event.target.value === event.target.value.toUpperCase()) {
        validation.lowercase = false
        setCheckLowercase("none")
        setunCheckLowercase("")
      } else {
        validation.lowercase = true
        setCheckLowercase("")
        setunCheckLowercase("none")
      }
      //Validate capital letters 
      if (event.target.value === event.target.value.toLowerCase()) {
        validation.capitalLetter = false
        setCheckCapital("none")
        setunCheckCapital("")
      } else {
        validation.capitalLetter = true
        setCheckCapital("")
        setunCheckCapital("none")
      }
      //Validate Numbers
      var numbers = /[0-9]/g;
      if (event.target.value.match(numbers)) {
        validation.number = true
        setCheckNumber("")
        setunCheckNumber("none")
      } else {
        validation.number = false
        setCheckNumber("none")
        setunCheckNumber("")
      }
      //Validate Symbol
      var symbol = /[!@#$%^&*]/g;
      if (event.target.value.match(symbol)) {
        validation.symbol = true
        setCheckSymbol("")
        setunCheckSymbol("none")
      } else {
        validation.symbol = false
        setCheckSymbol("none")
        setunCheckSymbol("")
      }
      if (validation.symbol && validation.number && validation.capitalLetter && validation.lenght && validation.lowercase) {
        setValidationFlag(true)
      } else {
        setValidationFlag(false)
      }
    }
    if (data.passwordConfirm === data.password && validationFlag && data.username !== "" && data.token !== "") {
      setbuttonStatus(false)
      setMatch("none")
    } else {
      setMatch("block")
      setbuttonStatus(true)

    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("submit")
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" sm="8" md="8" lg="5" xl="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>{t("Change password")}</h1>
                    <p className="text-medium-emphasis">{t("Change password for")} {user}</p>
                    <p className="error mb-1">{error}</p>
                    <Form.Label className="f-left mb-0">{t("Username")}</Form.Label>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faUser} />
                      </CInputGroupText>
                      <CFormControl
                        placeholder={user}
                        autoComplete="username"
                        onChange={handleChange}
                        required
                        id="username"
                        defaultValue={user}
                      />
                    </CInputGroup>
                    <Form.Label className="f-left mb-0">{t("Token")}</Form.Label>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faKey} />
                      </CInputGroupText>
                      <CFormControl
                        placeholder={token}
                        onChange={handleChange}
                        required
                        id="token"
                        defaultValue={token}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faLock} />
                      </CInputGroupText>
                      <CFormControl
                        type="password"
                        placeholder={t("Password")}
                        autoComplete="new-password"
                        required
                        onChange={handleChange}
                        id="password"
                      />
                    </CInputGroup>
                    <CFormText className="text-muted formText mb-4">
                      <p className="validation">{t("Make sure at least the new password have")}:
                        <br />
                        <span className="textGreen" style={{ "display": checkLenght }}>✓</span>
                        <span className="textRed" style={{ "display": uncheckLenght }}>✗</span>
                        {t("8 characters lenght")}
                        <br />
                        <span className="textGreen" style={{ "display": checkNumber }}>✓</span>
                        <span className="textRed" style={{ "display": uncheckNumber }}>✗</span>
                        {t("a number")}
                        <br />
                        <span className="textGreen" style={{ "display": checkLowercase }}>✓</span>
                        <span className="textRed" style={{ "display": uncheckLowercase }}>✗</span>
                        {t("a lowercase letter")}
                        <br />
                        <span className="textGreen" style={{ "display": checkCapital }}>✓</span>
                        <span className="textRed" style={{ "display": uncheckCapital }}>✗</span>
                        {t("a capital letter")}
                        <br />
                        <span className="textGreen" style={{ "display": checkSymbol }}>✓</span>
                        <span className="textRed" style={{ "display": uncheckSymbol }}>✗</span>
                        {t("a symbol")}
                      </p>
                    </CFormText>
                    <CInputGroup  >
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faLock} />
                      </CInputGroupText>
                      <CFormControl
                        type="password"
                        placeholder={t("Confirm password")}
                        autoComplete="new-password"
                        required onChange={handleChange}
                        id="passwordConfirm"
                      />
                    </CInputGroup>
                    <CFormText className="mb-4 text-muted formText" style={{ "display": match }}>
                      <p className="textRed validation">{t("The fields \"password\" and \"confirm password\" don't match")}</p>
                    </CFormText>
                    <CButton color="danger" type="submit" className='mainColor mt-4' disabled={buttonStatus} >
                      {t("Change password")}
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
