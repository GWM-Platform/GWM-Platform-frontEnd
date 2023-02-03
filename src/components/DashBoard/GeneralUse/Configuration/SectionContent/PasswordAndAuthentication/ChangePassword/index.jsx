import React, { useState, useRef, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { passwordStrength } from 'check-password-strength'
import { DashBoardContext } from 'context/DashBoardContext';
import { Col, Row, Container, Form, Button, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ChangePassword = ({ scrollIntoView }) => {
  const { toLogin, allowedSymbols } = useContext(DashBoardContext)

  const isMountedRef = useRef(null)

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const [validation, setValidation] = useState({
    passwordStrength: passwordStrength(''),
    match: true
  })

  const [validated, setValidated] = useState(false)
  const [Patch, setPatch] = useState({ fetching: false, fetched: false, success: false })

  const { t } = useTranslation()

  const initialState = {
    password: '',
    newPassword: '',
    confirmPassword: ''

  }
  const [data, setData] = useState(initialState)

  const handleChange = (event) => {
    const aux = data
    aux[event.target.id] = event.target.value
    setData((prevState) => ({ ...prevState, ...aux }))
    if (event.target.id === 'newPassword') {
      setValidation((prevState) => ({ ...prevState, passwordStrength: passwordStrength(event.target.value, undefined, allowedSymbols) }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const form = event.currentTarget
    if (form.checkValidity() && validation.passwordStrength.id >= 2 && validation.match && !Patch.fetching) {
      patchUserInfo()
    }

    setValidated(true)
  }

  const patchUserInfo = () => {
    setPatch((prevState) => ({ ...prevState, fetching: true, success: false, fetched: false }))
    axios.post('/users/changePassword',
      {
        oldPassword: data.password,
        newPassword: data.newPassword,
      }).then(function (response) {
        setPatch((prevState) => ({ ...prevState, fetching: false, success: true, fetched: true }))
        setData({ ...initialState })
        setValidated(false)
      }).catch((err) => {
        if (err.message !== 'canceled') {
          setPatch((prevState) => ({ ...prevState, fetching: false, success: false, fetched: true }))
          switch (err.response.status) {
            case 401:
              toLogin()
              break
            default:
              console.error(err)
          }
        }
      })
  }

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  useEffect(() => {
    setValidation((prevState) => ({ ...prevState, match: data.newPassword === data.confirmPassword }))
  }, [data])

  const myRef = useRef(null)

  const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

  useEffect(() => {
    if (scrollIntoView) executeScroll()
  }, [scrollIntoView])

  return (
    <Form ref={myRef} className="PasswordAndAuthentication" noValidate validated={validated} onSubmit={handleSubmit}>
      <h1 className="SectionTitle">{t('Update Password')}</h1>
      <Container className="mt-3 px-0" fluid>
        <Row className="gx-0">
          <Col lg="12" >
            <Container className="px-0" fluid>
              <Row>
                {Patch.fetched
                  ? <Col xs="12" className=" py-2 background-light">
                    {Patch.success
                      ? <p className="textGreen mb-0 validation text-center">
                        <FontAwesomeIcon className="me-2" icon={faCheckCircle} />
                        {t('Password updated succesfully')}
                      </p>
                      : <p className="textRed mb-0 validation text-center">
                        <FontAwesomeIcon className="me-2" icon={faTimesCircle} />
                        {t('There was an error updating the password. Check the "Old Password" field')}
                      </p>
                    }
                  </Col>
                  : null
                }
                <Col md={12} className=" mb-2">
                  <h1 className="label mt-0" >{t('Old Password')}</h1>
                  <Form.Control required id="password" onChange={(event) => { handleChange(event) }} value={data.password} type="password" maxLength={80} />
                </Col>

                <Col md={12} className=" mb-2">
                  <h1 className="label mt-0">{t('New Password')}</h1>
                  <Form.Control
                    required
                    id="newPassword"
                    onChange={handleChange}
                    value={data.newPassword}
                    type="password"
                    maxLength={80} />
                  <Form.Text className="text-muted formText">
                    <p className="validation mb-0">{t('Your new password must have')}:
                      <br />
                      {validationIcon(validation.passwordStrength.length >= 8)}
                      {t('8 characters length')}
                      <br />
                      {validationIcon(validation.passwordStrength.contains.includes('number'))}
                      {t('A number')}
                      <br />
                      {validationIcon(validation.passwordStrength.contains.includes('lowercase'))}
                      {t('A lowercase letter')}
                      <br />
                      {validationIcon(validation.passwordStrength.contains.includes('uppercase'))}
                      {t('A capital letter')}
                      <br />
                      {validationIcon(validation.passwordStrength.contains.includes('symbol'))}
                      {t('A symbol')} ({allowedSymbols})
                    </p>
                  </Form.Text>
                </Col>

                <Col md={12} className=" mb-2">
                  <h1 className="label mt-0">{t('Confirm New Password')}</h1>
                  <Form.Control
                    required id="confirmPassword" onChange={(event) => { handleChange(event) }} value={data.confirmPassword} type="password" maxLength={80} data-cy="input-confirm-new-password" pattern={escapeRegExp(data.newPassword)}
                  />
                  <Form.Text className={`mb-2 text-muted formText ${validation.match || data.confirmPassword.length === 0 ? 'd-none' : 'd-block'}`}>
                    <p className="textRed mb-0 validation">{t('The fields "New password" and "confirm password" must match')}</p>
                  </Form.Text>
                </Col>

                <Col xs="12" className="d-flex justify-content-start">
                  <Button
                    type="submit"
                    variant="danger"
                    className={'mainColor mb-2'}
                  >
                    <span>
                      <Spinner
                        className={Patch.fetching ? 'd-inline-block' : 'd-none'}
                        variant="light"
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </span>
                    {' '}{t('Submit')}
                  </Button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </Form>
  )
}
export default ChangePassword

const validationIcon = (valid) => {
  if (valid) {
    return <span className="pe-1 textGreen"> <FontAwesomeIcon icon={faCheckCircle} /></span>
  } else {
    return <span className="pe-1 textRed"> <FontAwesomeIcon icon={faTimesCircle} /></span>
  }
}
