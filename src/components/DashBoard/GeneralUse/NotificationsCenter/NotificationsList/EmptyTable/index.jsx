import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';

const EmptyTable = ({ NavInfoToggled, className = "" }) => {
  //To use the translations from i18n
  const { t } = useTranslation();
  return (
    <Row className={`w-100 d-flex loadingMovements ${className} ${NavInfoToggled ? "navInfoToggled" : ""} justify-content-center align-items-center`}>
      <Col
        className="d-flex justify-content-center align-items-center"
      >
        <div className='no-notifications'>
          <FontAwesomeIcon
            icon={faBellSlash}
          />
          <p>
            {t("You have no notifications with that search criteria")}
          </p>
        </div>
      </Col>
    </Row>
  )
}
export default EmptyTable
