import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import TableLastTransfers from './TableLastTransfers';

const MobileCard = ({ account }) => {
    const { t } = useTranslation();

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
                                <Card.Text>
                                    <span>{t("Balance")}: <span style={{ fontWeight: "bolder" }}>$</span>{account.balance}</span>
                                </Card.Text>
                            </Col>
                            <TableLastMovements account={account}/>
                            <TableLastTransfers account={account}/>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </>
    )
}
export default MobileCard

