import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Navbar, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { dashboardContext } from '../../../../../context/dashboardContext';

const SourceAccount = ({ Account }) => {
    const { t } = useTranslation();

    const { Accounts, contentReady } = useContext(dashboardContext);

    return (
        <Navbar className="navBarAvailableCash" bg="light">
            <Container className="px-0" fluid>
                <Row className="w-100 mx-0 d-flex justify-content-center">
                    <Col className="ps-2 ps-md-2 ps-lg-0" lg="auto">
                        <h1 className="total my-0 py-0 d-flex align-items-center growOpacity">
                            {t("Cash in account")}:&nbsp;

                            {
                                contentReady ?
                                    <span className="growOpacity">${Accounts[0].balance}</span>
                                    :
                                    <Spinner className="ms-2" animation="border" size="sm" />
                            }
                        </h1>
                    </Col>
                </Row>
            </Container>
        </Navbar>

    )
}

export default SourceAccount