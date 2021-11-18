import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'

const MobileCard = ({ setItemSelected,isMobile, className, Fund, categorySelected, Funds, numberOfFunds, ownKey }) => {
     // eslint-disable-next-line

    const { t } = useTranslation();
    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();  
        history.push(`/login`);
    }

    const movements=[{"date":"2021-09-08T13:07:28.000Z","number":"TR-00000313","description":"Descripcion 33","amount":-1},{"date":"2021-09-07T16:09:28.000Z","number":"TR-00000312","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T16:07:46.000Z","number":"TR-00000311","description":"descripcion","amount":-1},{"date":"2021-09-07T15:59:28.000Z","number":"TR-00000310","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T15:56:50.000Z","number":"TR-00000309","description":"Transferencia de algo","amount":-12},{"date":"2021-09-07T15:44:28.000Z","number":"TR-00000308","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T15:43:01.000Z","number":"TR-00000307","description":"descripcion","amount":-123},{"date":"2021-09-07T15:42:21.000Z","number":"TR-00000306","description":"descripcion","amount":-15},{"date":"2021-09-07T15:33:10.000Z","number":"TR-00000305","description":"descripcion","amount":-15},{"date":"2021-09-07T15:23:43.000Z","number":"TR-00000304","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T14:44:25.000Z","number":"TR-00000302","description":"000","amount":388},{"date":"2021-09-07T14:43:58.000Z","number":"TR-00000301","description":"Transferencia de algo","amount":-388},{"date":"2021-09-07T14:43:00.000Z","number":"TR-00000300","description":"descripcion","amount":-388},{"date":"2021-09-07T14:41:42.000Z","number":"TR-00000299","description":"Transferencia de algo","amount":-5000},{"date":"2021-09-07T14:31:58.000Z","number":"TR-00000298","description":"Transferencia de algo","amount":71.7}]

    return (
            <Card border="danger" className="movementsCardMobile">
                <Card.Header >
                    <Container fluid className="px-3">
                        <Row className="d-flex justify-content-end align-items-center">
                            <Col className="p-0">
                                <Card.Title className="mb-0 py-1">{t(Fund.description)}</Card.Title>
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Card.Body className={`${className} pb-0`}>
                    <Container fluid className="p-0">
                        <Row className="m-1">
                            
                            <Col xs="12">
                                <Card.Title >
                                    <span>
                                        {t("Fund Name")}
                                    </span>
                                </Card.Title>
                                <Card.Text>
                                    <span>{t("Balance")}: <span style={{ fontWeight: "bolder" }}>{Fund.currency.symbol}</span>{parseFloat(Fund.balance).toFixed(Fund.currency.decimals)}</span>
                                </Card.Text>
                            </Col>
                            <TableLastMovements
                                    isMobile={isMobile} content={movements} decimals={Fund.decimals} symbol={Fund.currency.symbol} />
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
    )
}
export default MobileCard

