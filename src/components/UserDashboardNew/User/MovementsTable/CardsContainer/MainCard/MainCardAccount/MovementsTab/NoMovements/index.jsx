import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

const NoMovements = ({NavInfoToggled}) => {
  //To use the translations from i18n
  const { t } = useTranslation();  
  return (
      <Row className={`w-100 d-flex loadingMovements ${NavInfoToggled ? "navInfoToggled" : ""} justify-content-center align-items-center`}>
        <Col
          className="d-flex justify-content-center align-items-center"
        >
          <span className="loadingText">{t("There are no movements to show")}</span>
        </Col>
      </Row>
  )
}
export default NoMovements
