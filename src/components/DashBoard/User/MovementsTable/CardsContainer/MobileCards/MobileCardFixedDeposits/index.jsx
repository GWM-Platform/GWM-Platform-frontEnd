import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye, faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import TableLastFixedDeposits from './TableLastFixedDeposits';

const MobileCardFixedDeposits = ({ FixedDepositsStats, Hide, setHide }) => {
    // eslint-disable-next-line
    const { t } = useTranslation();

    const Performance = FixedDepositsStats?.performancePercentage
    const PerformanceInCash = FixedDepositsStats?.performanceCash
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
                                            <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                                            <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                                            <FormattedNumber className={`info placeholder`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                                        </span>
                                    </div>
                                </Col>
                                <Col sm="auto" className="hideInfoButton d-flex align-items-center">
                                    <FontAwesomeIcon
                                        className={`icon ${Hide ? "hidden" : "shown"}`}
                                        onClick={() => { setHide(!Hide) }}
                                        icon={faEye}
                                    />
                                    <FontAwesomeIcon
                                        className={`icon ${!Hide ? "hidden" : "shown"}`}
                                        onClick={() => { setHide(!Hide) }}
                                        icon={faEyeSlash}
                                    />
                                    <FontAwesomeIcon
                                        className="icon placeholder"
                                        icon={faEyeSlash}
                                    />
                                </Col>
                            </div>
                            <span className='left'>
                                {t("Performance")}:&nbsp;
                                <strong className={{
                                    '1': 'text-green',
                                    '-1': 'text-red'
                                }[Math.sign(Performance || 0)]}>
                                    <FormattedNumber
                                        value={Performance || 0} suffix="%" fixedDecimals={2} />
                                    &nbsp;(
                                    <FormattedNumber
                                        value={PerformanceInCash || 0} prefix="U$D " fixedDecimals={2} />
                                    )
                                </strong>
                            </span>
                            <br />
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

