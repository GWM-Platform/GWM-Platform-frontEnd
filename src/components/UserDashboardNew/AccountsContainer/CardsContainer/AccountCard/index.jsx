import React from 'react'
import { useState } from 'react';
import { Row, Col, Card, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faIdCard, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import './index.css'
import ChangeNameModal from './ChangeNameModal'

const AccountCard = ({ account, accounts, setItemSelected }) => {
    const [Hide, setHide] = useState(false)
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { t } = useTranslation();
    let history = useHistory();

    const toTransaction = (type, account) => {
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
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                            <img className="currency px-0 mx-0" alt={account.type} src={process.env.PUBLIC_URL + '/images/'+account.type+'.svg'} />
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Card.Title >
                        <h1 className="title mt-0">
                            {t(account.description)}
                        </h1>
                        <h1 className="title">
                            <Row className="d-flex justify-content-between">
                                <div style={{ width: "auto" }}>
                                <span className="balanceAmount">
                                    <span>
                                        <span className="bolder">
                                            {account.currency.symbol}
                                        </span>
                                        {Hide ? parseFloat(account.balance).toFixed(account.currency.decimals).replace(/./g, "*") : parseFloat(account.balance).toFixed(account.currency.decimals)}
                                    </span>
                                </span>
                                </div>
                                <div style={{ width: "auto" }}>
                                    <FontAwesomeIcon
                                        onClick={() => {
                                            setHide(!Hide)
                                        }}
                                        icon={Hide ? faEyeSlash : faEye}
                                    />
                                </div>
                            </Row>
                        </h1>
                    </Card.Title>
                    <Card.Text>
                        <h3 className="subTitle lighter mt-0 mb-2">
                            Found Performance:<span className="bolder"> %1.7</span>
                        </h3>
                        <h3 className="subTitle lighter mt-0 mb-2">
                            Acquired FeeParts:<span className="bolder"> 22</span>
                        </h3>
                        <h3 className="subTitle lighter mt-0 mb-2">
                            FeePart Price:<span className="bolder"> $15</span>
                        </h3>
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col sm="6" className="d-flex justify-content-center p-0 m-0">
                            <Button onClick={()=>{handleShow()}}className="me-1 button left">
                                <FontAwesomeIcon icon={faIdCard} />
                            </Button>
                        </Col>
                        <Col sm="6" className="d-flex justify-content-center p-0 m-0">
                            <OverlayTrigger rootClose trigger='click' placement="left-start" overlay={
                                <Popover id="popover-basic" >
                                    <Popover.Header className="mt-0" as="h3">{t("Account menu")}</Popover.Header>
                                    <Popover.Body>
                                        {accounts.filter((n) => n.currency.name === account.currency.name).length > 1 ? <><span className="toTransaction" onClick={() => toTransaction(1,account)}>{t("Internal transaction")}</span></> : <></>}
                                        <span className="toTransaction" onClick={() => toTransaction(4,account)}>{t("Bank Transfer")}</span>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={account}>
                                <Button className="ms-1 button right">
                                    <FontAwesomeIcon onClick={(e) => { e.target.focus() }} icon={faPaperPlane} />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
            <ChangeNameModal show={show} handleClose={handleClose} />
        </Col>


    )
}
export default AccountCard