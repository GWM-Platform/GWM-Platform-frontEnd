import React from 'react'
import { useState } from 'react';
import { Row, Col, Card, Button,Popover,OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faIdCard, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import './index.css'
import ChangeNameModal from './ChangeNameModal'

const AccountCard = ({ account,accounts,setItemSelected }) => {
    const [Hide, setHide] = useState(false)
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
            <Card.Header>
                <h1 className="title">
                    {t(account.description)}
                </h1>
            </Card.Header>
            <Card.Body className="body">
                <Card.Title >
                   
                    <h2  className="subTitle lighter">
                        {t("Balance")}
                    </h2>
                    <h2 className="subTitle normal">
                        <Row className="d-flex justify-content-between">
                            <div style={{width:"auto"}}>
                                {Hide ? 
                                    toString(parseFloat(account.balance).toFixed(account.currency.decimals)).replace(/./g, "*") 
                                    :
                                        account.currency.symbol+
                                        parseFloat(account.balance).toFixed(account.currency.decimals)}
                                {" "}
                            </div>
                            <div style={{width:"auto"}}>
                                <FontAwesomeIcon
                                    onClick={() => {
                                        setHide(!Hide)
                                    }}
                                    icon={Hide ? faEyeSlash : faEye}
                                />
                            </div>
                        </Row>
                    </h2>
                    <h3 className="subTitle lighter">
                        Found Performance:<span className="bolder"> %1.7</span>
                    </h3>
                    <h3 className="subTitle lighter">
                        Acquired FeeParts:<span className="bolder"> 22</span>
                    </h3>
                    <h3 className="subTitle lighter">
                        FeePart Price:<span className="bolder"> $15</span>
                    </h3>
                   
                </Card.Title>
            </Card.Body>
            <Card.Footer className="footer">
                <Row className="d-flex justify-content-center">
                    <Col sm="auto" className="d-flex justify-content-center">
                        <Button onClick={()=>{handleShow()}}className="me-1 button">
                            <FontAwesomeIcon icon={faIdCard} />
                        </Button>
                        <OverlayTrigger rootClose trigger='click' placement="left-start" overlay={
                            <Popover id="popover-basic" >
                                <Popover.Header className="mt-0" as="h3">{t("Account menu")}</Popover.Header>
                                <Popover.Body>
                                    {accounts.filter((n) => n.currency.name === account.currency.name).length > 1 ? <><span className="toTransaction" onClick={() => toTransaction(1,account)}>{t("Internal transaction")}</span></> : <></>}
                                    <span className="toTransaction" onClick={() => toTransaction(4,account)}>{t("Bank Transfer")}</span>
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