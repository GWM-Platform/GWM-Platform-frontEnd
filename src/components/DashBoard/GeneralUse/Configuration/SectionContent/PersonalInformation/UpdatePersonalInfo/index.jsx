import React, { useState, useRef, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { DashBoardContext } from 'context/DashBoardContext';
import { Col, Row, Container, Form, Button, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { selectUser, setDataFromLogin } from 'Slices/DashboardUtilities/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const UpdatePersonalInfo = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const { toLogin } = useContext(DashBoardContext)

  const isMountedRef = useRef(null)

  const [validated, setValidated] = useState(false)
  const [Patch, setPatch] = useState({ fetching: false, fetched: false, success: false })

  const { t } = useTranslation()

  const initialState = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dni: user?.dni || "",
    phone: user?.phone || "",
    address: user?.address || "",
  }

  const [data, setData] = useState(initialState)

  const handleChange = (event) => {
    const aux = data
    aux[event.target.id] = event.target.value
    setData((prevState) => ({ ...prevState, ...aux }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const form = event.currentTarget
    setValidated(true)
    if (form.checkValidity() && !Patch.fetching) {
      patchUserInfo()
    }

  }

  const patchUserInfo = () => {
    setPatch((prevState) => ({ ...prevState, fetching: true, success: false, fetched: false }))
    axios.patch('/users/me',
      {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        phone: data.phone,
        address: data.address
      }).then(function (response) {
        setPatch((prevState) => ({ ...prevState, fetching: false, success: true, fetched: true }))
        dispatch(
          setDataFromLogin(
            {
              prevState: user,
              user: {
                firstName: data.firstName,
                lastName: data.lastName,
                dni: data.dni,
                phone: data.phone,
                address: data.address
              }
            }
          )
        )
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


  const myRef = useRef(null)

  return (
    <Form ref={myRef} className="PasswordAndAuthentication" noValidate validated={validated} onSubmit={handleSubmit}>
      <h1 className="SectionTitle">{t('Update Personal Information')}</h1>
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
                        {t('Personal information updated succesfully')}
                      </p>
                      : <p className="textRed mb-0 validation text-center">
                        <FontAwesomeIcon className="me-2" icon={faTimesCircle} />
                        {t('There was an error updating yout personal information')}
                      </p>
                    }
                  </Col>
                  : null
                }

                <Col md={6} className=" mb-2">
                  <h1 className="label mt-0">{t('First name')}</h1>
                  <Form.Control
                    required
                    id="firstName"
                    onChange={handleChange}
                    value={data.firstName}
                    type="text"
                    maxLength={30} />
                </Col>

                <Col md={6} className=" mb-2">
                  <h1 className="label mt-0">{t('Last name')}</h1>
                  <Form.Control
                    required
                    id="lastName"
                    onChange={handleChange}
                    value={data.lastName}
                    type="text"
                    maxLength={30} />
                </Col>

                <Col md={6} className=" mb-2">
                  <h1 className="label mt-0">{t('DNI')}</h1>
                  <Form.Control
                    required
                    id="dni"
                    onChange={handleChange}
                    value={data.dni}
                    type="text"
                    maxLength={30} />
                </Col>

                <div className='w-100 m-0' />

                <Col md={6} className=" mb-2">
                  <h1 className="label mt-0">{t('Phone number')}</h1>
                  <Form.Control
                    required
                    id="phone"
                    onChange={handleChange}
                    value={data.phone}
                    type="tel"
                    maxLength={30} />
                </Col>

                <Col md={6} className=" mb-2">
                  <h1 className="label mt-0">{t('Address')}</h1>
                  <Form.Control
                    required
                    id="address"
                    onChange={handleChange}
                    value={data.address}
                    type="text"
                    maxLength={30} />
                </Col>

                <Col xs="12" className="d-flex justify-content-end">
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
export default UpdatePersonalInfo