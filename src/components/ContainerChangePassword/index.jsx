import React, { useState, useRef, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { faKey, faLock, faUser, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { Col, Row, Container, Card, Form, Button, InputGroup } from 'react-bootstrap'
import { passwordStrength } from 'check-password-strength'

const ContainerForgotPassword = () => {
  const isMountedRef = useRef(null);

  const { t } = useTranslation();
  let history = useHistory();

  // eslint-disable-next-line 
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const email = useQuery().get("email")
  const token = useQuery().get("token")

  const symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

  const [data, setData] = useState({
    token: token ? token : "",
    email: email ? email : "",
    password: "",
    passwordConfirm: "",
  })

  const [ToAPI, setToAPI] = useState({
    token: token !== undefined ? token : "",
    email: email !== undefined ? email : "",
    password: ""
  })

  const [ButtonDisabled, setButtonDisabled] = useState(true)
  const [validation, setValidation] = useState(passwordStrength(''))
  const [validated, setValidated] = useState(false)
  const [match, setMatch] = useState(true)
  //eslint-disable-next-line
  const [Message, setMessage] = useState("")
  const [ShowRequirements, setShowRequirements] = useState(false)

  const toLogin = () => {
    history.push(`/login`);
  }

  const handleChange = (event) => {
    let aux = data
    aux[event.target.id] = event.target.value

    if (event.target.id !== "passwordConfirm") {
      let auxToAPI = {}
      auxToAPI[event.target.id] = event.target.value
      setToAPI((prevState) => ({ ...prevState, ...auxToAPI }))
    }
    if (event.target.id === "password") {
      setValidation(passwordStrength(event.target.value))
    }
    setData((prevState) => ({ ...prevState, ...aux }))

    setMatch(aux.passwordConfirm === aux.password)
    if (aux.passwordConfirm === aux.password && aux.email !== "" && aux.token !== "" && validation.id >= 2) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true)
    if (form.checkValidity()) {
      changePassword()
      setButtonDisabled(true)
    }
  }

  const changePassword = async () => {
    setButtonDisabled(true)
    var url = `${process.env.REACT_APP_APIURL}/users/resetPassword`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(ToAPI),
      headers: {
        Accept: "*/*",
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      if (isMountedRef) {
        setMessage("Your password has been successfully reset")
        setButtonDisabled(false)
      }
    } else {
      if (isMountedRef) {
        setButtonDisabled(false)
      }
      switch (response.status) {
        case 500:
          if (isMountedRef) {
            setMessage("Error. Check the entered data")
          }
          break;
        default:
          console.log(response.status)
          if (isMountedRef) {
            setMessage("Error. Check the entered data")
          }
      }
    }
  }

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  useEffect(() => {
    isMountedRef.current = true;
    return () => isMountedRef.current = false;
  }, [])

  return (
    <div className="changePassword min-vh-100 p-relative">
      <Button className="button toLogin" variant="danger" type="button" onClick={() => toLogin()} >
        <FontAwesomeIcon className="icon" icon={faChevronLeft} />
        {t("To login")}
      </Button>
      <Container fluid>
        <Row className="justify-content-center pt-3 pt-sm-5">
          <Col className="cardContainer" xs="12" sm="8" md="8" lg="5" xl="4">
            <Card className="p-0 p-sm-4">
              <Card.Body className="px-0 px-sm-3">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <h1 className="mt-0 pb-2">{t("Change password")}</h1>
                  <p className="Message mb-1">{t(Message)}</p>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder={t("e-Mail")}
                      value={data.email}
                      autoComplete="email"
                      onChange={handleChange}
                      required
                      id="email"
                      type="mail"
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faKey} />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Token"
                      onChange={handleChange}
                      required
                      id="token"
                      value={data.token}
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faLock} />
                    </InputGroup.Text>
                    <Form.Control
                      onFocus={() => setShowRequirements(true)}
                      onBlur={() => setShowRequirements(false)}
                      type="password"
                      placeholder={t("Password")}
                      autoComplete="new-password"
                      required
                      pattern={`(?=.*[${escapeRegExp(symbols)}])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}`}
                      onChange={handleChange}
                      id="password"
                      value={data.password}
                    />
                  </InputGroup>
                  <div className={ShowRequirements ? "expanded" : "collapsed"}>
                    <Form.Text className={`text-muted formText mb-4`}>
                      <p className="validation mb-1 ">{t("Your new password must have")}:
                        <br />
                        {validationIcon(validation.length >= 8)}
                        {t("8 characters length")}
                        <br />
                        {validationIcon(validation.contains.includes('number'))}
                        {t("A number")}
                        <br />
                        {validationIcon(validation.contains.includes('lowercase'))}
                        {t("A lowercase letter")}
                        <br />
                        {validationIcon(validation.contains.includes('uppercase'))}
                        {t("A capital letter")}
                        <br />
                        {validationIcon(validation.contains.includes('symbol'))}
                        {t("A symbol")} ({symbols})
                      </p>
                    </Form.Text>
                  </div>

                  <InputGroup  >
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faLock} />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder={t("Confirm password")}
                      autoComplete="new-password"
                      required onChange={handleChange}
                      pattern={escapeRegExp(data.password)}
                      id="passwordConfirm"
                      value={data.passwordConfirm}
                    />
                  </InputGroup>

                  <Form.Text className="text-muted  formText">
                    <p className={`${match ? "" : "textRed"} validation`}>{t("The fields \"password\" and \"confirm password\" must match")}</p>
                  </Form.Text>

                  <Button className="mt-2 button" variant="danger" type="submit" disabled={ButtonDisabled} >
                    {t("Change password")}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContainerForgotPassword

const validationIcon = (valid) => {
  if (valid) {
    return <span className="pe-1 textGreen"> <FontAwesomeIcon icon={faCheckCircle} /></span>
  } else {
    return <span className="pe-1 textRed"> <FontAwesomeIcon icon={faTimesCircle} /></span>
  }
}