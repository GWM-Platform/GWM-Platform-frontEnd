import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row, Spinner } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import TableLastTransfers from './TableLastTransfers';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerformance, selectPerformanceById } from 'Slices/DashboardUtilities/performancesSlice';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { useEffect } from 'react';

const MobileCard = ({ account }) => {
    const { t } = useTranslation();
    const { ClientSelected } = useContext(DashBoardContext)

    const dispatch = useDispatch()

    const performance = useSelector(state => selectPerformanceById(state, "totalPerformance"))

    useEffect(() => {
        dispatch(fetchPerformance({
            totalPerformance: true,
            clientId: ClientSelected?.id
        }))
    }, [ClientSelected, dispatch])

    return (
        <>
            <Card className="movementsCardMobile">
                <Card.Header >
                    <Container fluid className="px-3">
                        <Row className="d-flex justify-content-end align-items-center">
                            <Col className="p-0">
                                <Card.Title className="mb-0 py-1">
                                    {t("Cash")}
                                    <img alt="cash" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                                </Card.Title>
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Card.Body className="pb-0 pt-1">
                    <Container fluid className="p-0">
                        <Row className="m-1">
                            <Col xs="12" className="px-0">
                                <Card.Text className='mb-0'>
                                    <span>{t("Balance")}:&nbsp;
                                        <FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} />
                                    </span>
                                </Card.Text>
                                {
                                    performance &&
                                    <PerformanceComponent text={"Performance"} performance={performance?.performance} status={performance?.status} />
                                }
                            </Col>
                            <TableLastMovements account={account} />
                            <TableLastTransfers account={account} />
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </>
    )
}
export default MobileCard

const PerformanceComponent = ({ text, performance = 0, status = "loading" }) => {
    const { t } = useTranslation();

    return (
        <span className='text-start w-100 d-block' style={{ fontWeight: "300" }}>
            {t(text)}:&nbsp;
            {
                status === "loading" ?
                    <Spinner size="sm" className="me-2" animation="border" variant="primary" />
                    :
                    <strong>
                        <FormattedNumber className={{
                            '1': 'text-green',
                            '-1': 'text-red'
                        }[Math.sign(performance)]}
                            value={performance} prefix="U$D " fixedDecimals={2} />
                    </strong>
            }
        </span>
    )
}