import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap'
import User from './User'
import './index.scss'
const Content = ({ users, permissions, funds, getUsers }) => {

  const { t } = useTranslation()


  return (
    <div className="AccessAndPermissionsAdministration"  >
      <h1 className="SectionTitle mb-0">{t('Access and permissions administration')}</h1>
      <Container className="px-0" fluid>
        <Row className="gx-0">
          <Col lg="12" >
            <Accordion flush alwaysOpen className="usersList">
              {
                users.map(user => <User getUsers={getUsers} key={`user-${user.id}`} user={user} permissions={permissions} funds={funds} />)
              }
              <div className="my-2 d-flex justify-content-end">
                <Button disabled>{t("Connect a new user")}</Button>
              </div>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default Content