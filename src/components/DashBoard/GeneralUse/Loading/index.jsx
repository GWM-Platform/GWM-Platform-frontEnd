import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Decimal from 'decimal.js';

const Loading = ({ movements, style = {} }) => {
  Decimal.set({ precision: 100 })
  //To use the translations from i18n
  const { t } = useTranslation();
  return (
    <Row style={{ ...style, ...movements ? { height: `calc( ( ( 0.5rem * 2 + 25.5px ) * ${Decimal(movements).add(1).toString()} ) + .5rem )` } : {} }}
      className={`w-100 d-flex loadingMovements justify-content-center align-items-center`}>
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
