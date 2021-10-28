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

const FoundCard = ({ found, founds, setItemSelected }) => {
    const [Hide, setHide] = useState(false)
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { t } = useTranslation();
    let history = useHistory();

    const toTransaction = (type, found) => {
        history.push(`transactionRequest/${found.id}/${type}`);
        if (type === 4) {
            setItemSelected("otherTransaction")
        } else {
            setItemSelected("internalTransaction")
        }
    }

    return (
        <Col sm="6" md="6" lg="4">
            <Card className="foundCard">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                            <img className="currency px-0 mx-0" alt={found.type} src={process.env.PUBLIC_URL + '/images/'+found.type+'.svg'} />
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Card.Title >
                        <h1 className="title mt-0">
                            {t(found.description)}
                        </h1>
                        <h1 className="title">
                            <Row className="d-flex justify-content-between">
                                <div style={{ width: "auto" }}>
                                <span className="balanceAmount">
                                    <span>
                                        <span className="bolder">
                                            {found.currency.symbol}
                                        </span>
                                        {Hide ? parseFloat(found.balance).toFixed(found.currency.decimals).replace(/./g, "*") : parseFloat(found.balance).toFixed(found.currency.decimals)}
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
                    <Card.Text className="subTitle lighter mt-0 mb-2">
                            Found Performance:<span className="bolder"> %1.7</span><br/>
                            Acquired FeeParts:<span className="bolder"> 22</span><br/>
                            FeePart Price:<span className="bolder"> $15</span><br/>
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
                                    <Popover.Header className="mt-0">{t("found menu")}</Popover.Header>
                                    <Popover.Body>
                                        {founds.filter((n) => n.currency.name === found.currency.name).length > 1 ? <><span className="toTransaction" onClick={() => toTransaction(1,found)}>{t("Internal transaction")}</span></> : <></>}
                                        <span className="toTransaction" onClick={() => toTransaction(4,found)}>{t("Bank Transfer")}</span>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={found}>
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
export default FoundCard