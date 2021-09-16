import React from 'react'
import { useState } from 'react';
import { Row, Col, Card, Button,Popover,OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faIdCard, faPaperPlane,faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import './index.css'
import ChangeNameModal from './ChangeNameModal'

const AccountCard = ({ account,accounts,setItemSelected }) => {
    const [Hide, setHide] = useState(true)
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { t } = useTranslation();
    let history = useHistory();

    const toTransaction = (type,account) => {
        history.push(`transactionRequest/${account.id}/${type}`);
        if (type === 4) {
            setItemSelected("otherTransaction")
        } else {
            setItemSelected("internalTransaction")
        }
    }

    return (
        <Col sm="6" md="6" lg="4">
            <Card className="accountCard">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <h1 className="currency" >
                        {account.currency.symbol}
                    </h1>
                </Card.Header>
                <Card.Body className="body">
                    <Card.Title >
                        <h1 className="title">
                            {t(account.description)}
                        </h1>
                        <h1 className="title">
                            <Row className="d-flex justify-content-between">
                                <Col>
                                    {Hide ? account.externalNumber.replace(/./g, "*") : account.externalNumber}{" "}
                                </Col>
                                <Col sm="auto">
                                    <FontAwesomeIcon
                                        onClick={() => {
                                            setHide(!Hide)
                                        }}
                                        icon={Hide ? faEyeSlash : faEye}
                                    />
                                </Col>
                            </Row>
                        </h1>
                    </Card.Title>
                    <Card.Text>
                        <h2 className="balanceAmount">
                            <span>
                                <span className="bolder">
                                    {account.currency.symbol}
                                </span>
                                {parseFloat(account.balance).toFixed(account.currency.decimals)}
                            </span>
                        </h2>
                        <h3 className="balance lighter">
                            {t("Balance")}
                        </h3>
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="footer">
                    <Row className="d-flex justify-content-center">
                        <Col sm="auto">
                            <Button onClick={()=>{handleShow()}}className="me-1 button">
                                <FontAwesomeIcon icon={faIdCard} />
                            </Button>
                            <OverlayTrigger rootClose trigger='click' placement="left-start" overlay={
                                <Popover id="popover-basic" >
                                    <Popover.Header className="mt-0" as="h3">{t("Account menu")}</Popover.Header>
                                    <Popover.Body>
                                        {accounts.filter((n) => n.currency.name === account.currency.name).length > 1 ? <><span className="toTransaction" onClick={() => toTransaction(1,account)}><strong><FontAwesomeIcon icon={faChevronRight} /></strong> {t("Internal transaction")}</span><br></br></> : <></>}
                                        <span className="toTransaction" onClick={() => toTransaction(4,account)}><strong><FontAwesomeIcon icon={faChevronRight} /></strong> {t("Other transfers")}</span><br></br>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={account}>
                                <Button className="ms-1 button">
                                    <FontAwesomeIcon onClick={(e) => { e.target.focus() }} icon={faPaperPlane} />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
            <ChangeNameModal show={show} handleClose={handleClose}/>
        </Col>

    )
}
export default AccountCard