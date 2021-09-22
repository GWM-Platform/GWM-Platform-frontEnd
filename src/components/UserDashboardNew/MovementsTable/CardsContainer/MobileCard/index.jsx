import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Popover, Button, OverlayTrigger, Card, Container, Col, Row } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { urlContext } from '../../../../../context/urlContext';

const MobileCard = ({ setItemSelected,isMobile, className, account, categorySelected, accounts, numberOfAccounts, ownKey }) => {
    const [Hide, setHide] = useState(true)
    const {urlPrefix}=useContext(urlContext)

    let movsShown
    if (isMobile) {
        movsShown = Math.round(((window.innerHeight - 250) - 41) / (41 + 38) - 1)
    } else {
        movsShown = (Math.round(((window.innerHeight - 250) - 41) / 41) - 1)
    }

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

    const toLogin = () => {
        sessionStorage.clear();        history.push(`/login`);
    }

    const [movements, setMovements] = useState([])

    const getMovements = (token) => {
        var url = `http://nbanking-staging-alb-978508132.us-east-1.elb.amazonaws.com/customers/accounts/${account.id}/movements?` + new URLSearchParams({
            limit: movsShown,
            offset: 0,
        });
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.statusCode === undefined) {
                    setMovements(response)
                    if (response.statusCode === undefined) {
                    } else {
                        console.log("fetch to get movements :", response.statusCode)
                    }
                } else {
                    console.log("the communication with the API ")
                    toLogin()
                }
            });
    }

    let token = sessionStorage.getItem('access_token')

    if(token===null){
        toLogin()
    }

    useEffect(() => {
        getMovements(token);
        return () => {
        }
    }, [token, account])

    return (
        <div>
            <Card border="danger" className="mb-2">
                <Card.Header >
                    <Container fluid className="px-3">
                        <Row className="d-flex justify-content-end align-items-center">
                            <Col className="p-0">
                                <Card.Title className="mb-0">{t(account.description)}</Card.Title>
                            </Col>
                            <Col xs="auto" sm="3" className="p-0">
                                <OverlayTrigger rootClose trigger='click' placement="left-start" overlay={
                                    <Popover id="popover-basic" >
                                        <Popover.Header as="h3" className="mt-0">{t("Account menu")}</Popover.Header>
                                        <Popover.Body>
                                            {accounts.filter((n) => n.currency.name === account.currency.name).length > 1 ? <><span className="toTransaction" onClick={() => toTransaction(1)}><strong><FontAwesomeIcon icon={faChevronRight} /></strong> {t("Internal transaction")}</span><br></br></> : <></>}
                                            <span className="toTransaction" onClick={() => toTransaction(4)}><strong><FontAwesomeIcon icon={faChevronRight} /></strong> {t("Other transfers")}</span><br></br>
                                        </Popover.Body>
                                    </Popover>
                                } popperConfig={account}>
                                    <Button onClick={(e) => { e.target.focus() }} className="mainColor overlayTrigger" variant="danger" >☰</Button>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Card.Body className={`${className} pb-0`}>
                    <Container fluid className="p-0">
                        <Row className="m-1">
                            <Col xs="3" sm="2" md="1" lg="1" className="currency d-flex align-items-center justify-content-center">
                                <h2>{account.currency.code}</h2>
                            </Col>
                            <Col xs="9" sm="10" md="11" lg="11">
                                <Card.Title >
                                    <span className="d-none d-sm-block">
                                        {t("Account Number")}: {Hide ? account.externalNumber.replace(/./g, "*") : account.externalNumber}{" "}
                                        <FontAwesomeIcon
                                            onClick={() => {
                                                setHide(!Hide)
                                            }}
                                            icon={Hide ? faEyeSlash : faEye}
                                        />
                                    </span>
                                </Card.Title>
                                <Card.Text>
                                    <span>{t("Balance")}: <span style={{ fontWeight: "bolder" }}>{account.currency.symbol}</span>{parseFloat(account.balance).toFixed(account.currency.decimals)}</span>
                                </Card.Text>
                            </Col>
                            <TableLastMovements
                                    isMobile={isMobile} content={movements} decimals={account.decimals} symbol={account.currency.symbol} />
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    )
}
export default MobileCard

