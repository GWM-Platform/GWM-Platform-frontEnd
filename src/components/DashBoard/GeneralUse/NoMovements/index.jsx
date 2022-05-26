import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './index.css'
const NoMovements = ({ movements }) => {
  //To use the translations from i18n
  const { t } = useTranslation();
  return (
    <Row style={{ height: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
      className={`w-100 d-flex loadingMovements justify-content-center align-items-center`}>
      <Col className="d-flex justify-content-center align-items-center">
        <div className="emptyTable">
          <span className="icon"><FontAwesomeIcon  icon={faSearch} /></span>
          <span className="text">{t("There are no results")}</span>
        </div>
      </Col>
    </Row>
  )
}
export default NoMovements
