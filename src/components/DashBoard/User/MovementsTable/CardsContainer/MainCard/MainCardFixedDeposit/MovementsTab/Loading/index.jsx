import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Loading = ({ NavInfoToggled }) => {
  //To use the translations from i18n
  const { t } = useTranslation();
  return (
    <Row className={`w-100 d-flex loadingMovements ${NavInfoToggled ? "navInfoToggled" : ""} justify-content-center align-items-center`}>
      <Col
        className="d-flex justify-content-center align-items-center"
      >
        <Spinner className="me-2" animation="border" variant="primary" />
        <span className="loadingText">{t("Loading")}</span>
      </Col>
    </Row>
  )
}
export default Loading
