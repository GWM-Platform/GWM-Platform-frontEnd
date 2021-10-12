import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import FormDesktop from './FormDesktop';

import { Col, Row, Container} from 'react-bootstrap'
import FormMobile from './FormMobile';

const ContainerLogin = () => {
  
  return (
    <div className="login">
      <Container>
        <Row className="d-flex min-vh-100  justify-content-center align-items-start align-items-lg-center pt-3">
          <Col xs="11" sm="8" md="6" lg="4" xl="3">
            <FormDesktop />
            <FormMobile />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContainerLogin