import React, { /* useContext */ } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import TableLastTransfers from './TableLastTransfers';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
// import { YearlyStatement } from '../../MainCard/MainCardAccount';
// import { DashBoardContext } from 'context/DashBoardContext';

const MobileCard = ({ account }) => {
    const { t } = useTranslation();
    // const { ClientSelected } = useContext(DashBoardContext)

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
                            <Col className="px-0 me-auto mt-2" xs="auto">
                                <Card.Text className='mb-0'>
                                    <span>{t("Balance")}:&nbsp;
                                        <FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} />
                                    </span>
                                </Card.Text>
                            </Col>
                            {/* <Col className='p-0' xs="auto">
                                <YearlyStatement
                                    label={"Tenencias"} selectWidth='12ch' selectClassName="ms-0"
                                    wrapperClassName="d-inline-block mt-2 mb-0 p-0" ClientSelected={ClientSelected} />
                            </Col> */}
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