import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { DashBoardContext } from 'context/DashBoardContext'
const ConnectUserForm = ({ users, getUsers }) => {

  const { ClientSelected, toLogin, DashboardToastDispatch } = useContext(DashBoardContext);

  const { t } = useTranslation()
  const history = useHistory()

  const [ConnectUser, setConnectUser] = useState({
    fetching: false
  })

  const [email, setEmail] = useState("")

  const connectUser = () => {
    setConnectUser(() => (
      {
        fetching: true,
      }))
    axios.post(`/clients/clientConnect`, {
      email: email,
      clientId: ClientSelected.id
    }).then(function () {
      history.push("Configuration?section=Access+and+permissions+administration")
      DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "User connected successfully" } });
      getUsers()
    }).catch((err) => {
      if (err.message !== "canceled") {
        if (err.response.status === "401") toLogin()
        setConnectUser(() => (
          {
            fetching: false,
          }))
        DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error connecting the user" } });
      }

    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      connectUser()
    }
  }

  const alreadyConnected = () => users?.map(user => user.email)?.includes(email)
  const pattern = () => alreadyConnected() ? "" : undefined

  return (
    <div className="AccessAndPermissionsAdministration"  >
      <h1 className="SectionTitle mb-0">{t('Connect a new user')}</h1>
      <Container className="px-0" fluid>
        <Row className="gx-0">
          <Col lg="12" >
            <Form noValidate validated onSubmit={handleSubmit}>
              <Form.Group className="mt-2" controlId="exampleForm.ControlInput1">
                <Form.Label>{t("Email")}</Form.Label>
                <Form.Control
                  value={email} type="email" required pattern={pattern()}
                  onChange={(e) => { setEmail(e.target.value) }}
                />
                {
                  alreadyConnected() &&
                  <Form.Text className='text-danger'>
                    {t("The email entered is already connected to the client")}
                  </Form.Text>
                }
              </Form.Group>

              <div className='d-flex justify-content-end mt-2'>
                <Button
                  type="button" className="me-2"
                  onClick={() => history.push("Configuration?section=Access+and+permissions+administration")}>
                  {t("Cancel")}</Button>
                <Button type="submit" disabled={ConnectUser.fetching}>
                  {
                    ConnectUser.fetching &&
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='me-2' />
                  }
                  {t("Submit")}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ConnectUserForm