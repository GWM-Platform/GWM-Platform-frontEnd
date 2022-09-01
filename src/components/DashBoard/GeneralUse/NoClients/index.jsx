import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

const NoClients = () => {
  //To use the translations from i18n
  const { t } = useTranslation();

  return (
    <Container>
      <Row className="min-100vh d-flex align-items-center">
        <Col xs="12" className="d-flex justify-content-center align-items-center flex-column">
          <span className="h2">{t("It seems your user does not have access to any client")}</span>
          <span className="h5">{t("Contact an administrator to normalize your situation")}</span>
          <Link to="/login">
            <Button className="mt-2">{t("Return to login")}</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  )
}
export default NoClients
