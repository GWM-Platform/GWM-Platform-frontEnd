import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Accordion, Col, Container, Row } from 'react-bootstrap'
import User from './User'
import './index.scss'
const Content = ({ users }) => {

  const { t } = useTranslation()

  return (
    <div className="AccessAndPermissionsAdministration"  >
      <h1 className="SectionTitle">{t('Access and permissions administration')}</h1>
      <Container className="px-0" fluid>
        <Row className="gx-0">
          <Col lg="12" >
            <Accordion flush alwaysOpen>
              {
                users.map(user => <User key={`user-${user.id}`} user={user} />)
              }
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default Content