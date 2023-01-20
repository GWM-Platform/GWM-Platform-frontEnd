import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap'
import User from './User'
import './index.scss'
import { DashBoardContext } from 'context/DashBoardContext'
import { useHistory, useLocation } from 'react-router-dom'
import ConnectUserForm from './ConnectUserForm'
const Content = ({ users, permissions, funds, getUsers }) => {

  const { t } = useTranslation()
  const { hasPermission } = useContext(DashBoardContext);
  const history = useHistory()

  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const connectUser = (useQuery().get('connectUser') + '').toLowerCase() === 'true'

  return (
    connectUser ?
      <ConnectUserForm getUsers={getUsers} users={users} />
      :
      <div className="AccessAndPermissionsAdministration"  >
        <h1 className="SectionTitle mb-0">{t('Access and permissions administration')}</h1>
        <Container className="px-0" fluid>
          <Row className="gx-0">
            <Col lg="12" >
              <Accordion flush alwaysOpen className="usersList">
                {
                  users.map(user => <User getUsers={getUsers} key={`user-${user.id}`} user={user} permissions={permissions} funds={funds} users={users} />)
                }
                <div className="my-2 d-flex justify-content-end">
                  <Button onClick={() => history.push("Configuration?section=Access+and+permissions+administration&connectUser=true")} disabled={!hasPermission('ADD_USERS')}>
                    {t("Connect a new user")}
                  </Button>
                </div>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </div>
  )
}
export default Content