import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse, Card, Container, Col, Row, Popover, OverlayTrigger, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import {  useRef } from 'react'
import { useHistory } from 'react-router-dom'

const SecondaryCard = ({ setItemSelected,account,accounts, setCategorySelected, setSelected, parentKey, ownKey, selected, categorySelected, display,numberOfAccounts }) => {
    const select = () => {
        setCategorySelected(parentKey)
        setSelected(ownKey)
    }

    const ref = useRef(null)

    const { t } = useTranslation();
    let history = useHistory();

    const toTransaction = (type) => {
        history.push(`transactionRequest/${account.id}/${type}`);
        if(type===4){
            setItemSelected("otherTransaction")
        }else{
            setItemSelected("internalTransaction")
        }
    }


    return (
        <Collapse in={display} className="pt-0 pb-2">
            <div>
                <Card className="cardText" border="danger">
                    <Card.Header >
                        <Container fluid className="px-3">
                            <Row className="d-flex justify-content-start align-items-center">
                                <Col className="p-0">
                                    <Card.Title className="mb-0">{t(account.description)}</Card.Title>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Header>
                    <Card.Body onClick={select}>
                        <Container fluid className="p-0" ref={ref}>
                            <Row className="m-1">
                                <Col xs="5" sm="2" md="1" lg="3" className="currency d-flex align-items-center justify-content-center">
                                    <h2>{account.currency.code}</h2>
                                </Col>
                                <Col xs="7" sm="10" md="11" lg="9">
                                    <Card.Title className="d-none d-md-block d-lg-none d-xl-none">{t("Account Number")}: {account.externalNumber.replace(/./g, "*")}</Card.Title>
                                    <Card.Text>
                                        <span>{t("Balance")}: <span style={{ fontWeight: "bolder" }}>{account.currency.symbol}</span>{parseFloat(account.balance).toFixed(account.currency.decimals)}</span>
                                    </Card.Text>
                                    <Card.Title style={{visibility:"hidden"}} className="d-block d-md-none d-lg-block d-xl-block">a</Card.Title>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </div>
        </Collapse>
    )
}
export default SecondaryCard
