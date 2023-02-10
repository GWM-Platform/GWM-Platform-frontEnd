import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const EmptyTable = ({ NavInfoToggled,className="" }) => {
  //To use the translations from i18n
  const { t } = useTranslation();
  return (
    <Row className={`w-100 d-flex loadingMovements ${className} ${NavInfoToggled ? "navInfoToggled" : ""} justify-content-center align-items-center`}>
      <Col
        className="d-flex justify-content-center align-items-center"
      >
        <div className="emptyTable">
          <span className="icon"><FontAwesomeIcon icon={faSearch} /></span>
          <span className="text">{t("There are no results")}</span>
        </div>
      </Col>
    </Row>
  )
}
export default EmptyTable
