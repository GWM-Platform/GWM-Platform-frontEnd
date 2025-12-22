import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Navbar, Row, Container, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const Footer = () => {
    const { t } = useTranslation()
    const date = moment(process.env.REACT_APP_VERSION_DATE);
    return (
        <Navbar sticky="bottom" variant="dark" className="d-none d-sm-block navBarFooter">
            <Container>
                <Row className=" w-100 d-flex justify-content-end align-items-center">
                    <Col>
                        <span className="text">Versión {process.env.REACT_APP_VERSION}{date.isValid() ? `, ${date.format('L')}` : ''}</span>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                        <span className="text">Copyright © {moment().format("YYYY")}, GWMG. {t("All rights reserved")}</span>
                    </Col>
                </Row>
            </Container>

        </Navbar>
    )
}
export default Footer
