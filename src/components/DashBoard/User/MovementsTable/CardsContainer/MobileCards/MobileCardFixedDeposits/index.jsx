import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import TableLastFixedDeposits from './TableLastFixedDeposits';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';

const MobileCardFixedDeposits = ({ FixedDepositsStats, Hide, setHide }) => {
    // eslint-disable-next-line
    const { t } = useTranslation();
    
    const ActiveFixedDeposits = FixedDepositsStats?.activeDeposits
    const balanceInCash = FixedDepositsStats?.balance

    return (
        <Card className="movementsCardMobile">
            <Card.Header >
                <Container fluid className="px-3">
                    <Row className="d-flex justify-content-end align-items-center">
                        <Col className="p-0">
                            <Card.Title className="mb-0 py-1">
                                {t("Time deposits")}

                                <FontAwesomeIcon className="float-end me-1" color='white' icon={faPiggyBank} />
                            </Card.Title>
                        </Col>
                    </Row>
                </Container>
            </Card.Header>
            <Card.Body className="pb-0 pt-1">
                <Container fluid className="p-0">
                    <Row className="m-1">
                        <Col xs="12" className="px-0">
                            <div className="d-flex justify-content-between px-0" sm="auto">
                                <Col className="pe-2">
                                    <div className="containerHideInfo px-0 description">
                                        <span>{t("Balance")}:&nbsp;</span>
                                        <span style={{ fontWeight: "bolder" }}>
                                            <FormattedNumber  value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                                        </span>
                                    </div>
                                </Col>
                              
                            </div>
                            <PerformanceComponent text="Performance" fixedDepositId='1'/>
                            <span className="left">
                                {t("Active time deposits")}:&nbsp;{ActiveFixedDeposits}
                            </span>
                        </Col>
                        {
                            <TableLastFixedDeposits />
                        }
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}
export default MobileCardFixedDeposits

