import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Row,
  Container,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Loading = () => {
  //To use the translations from i18n
  const { t } = useTranslation();  
  return (
      <Row className="w-100 d-flex loadingMovements justify-content-center align-items-center">
        <Col
          className="d-flex justify-content-center align-items-center"
        >
          <Spinner className="me-2" animation="border" variant="danger" />
          <span className="loadingText">{t("Loading")}</span>
        </Col>
      </Row>
  )
}
export default Loading
