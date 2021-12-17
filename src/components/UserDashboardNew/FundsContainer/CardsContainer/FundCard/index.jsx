import React from 'react'
import { useState } from 'react';
import { Container,Row, Col, Card, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faIdCard, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import ChangeNameModal from './ChangeNameModal'

const FundCard = ({ Hide, setHide, Fund }) => {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { t } = useTranslation();

    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4">
            <Card className="FundCard h-100">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        {
                            Fund.fund.type !== undefined ?
                                <img className="currency px-0 mx-0" alt={Fund.fund.type} src={process.env.PUBLIC_URL + '/images/' + Fund.fund.type + '.svg'} />
                                :
                                <img className="currency px-0 mx-0" alt="crypto" src={process.env.PUBLIC_URL + '/images/crypto.svg'} />
                        }
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Row className="h-100 align-content-between">
                        <Card.Title >
                            <h1 className="title mt-0">
                                {t(Fund.fund.name)}
                            </h1>
                        </Card.Title>
                        <Container>
                            <Row className="d-flex justify-content-between">
                                <h1 className="title mt-1">
                                    <Row className="d-flex justify-content-between">
                                        <div className="pe-2 containerHideInfo">
                                            <span>$</span>
                                            <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                                {(Fund.shares * Fund.fund.sharePrice).toString().replace(/./g, "*")}
                                            </span>
                                        
                                            <span className={`info ${Hide? "hidden" : "shown"}`}>
                                                {(Fund.shares * Fund.fund.sharePrice).toString()}
                                            </span>

                                            <span className={`info placeholder`}>
                                                {(Fund.shares * Fund.fund.sharePrice).toString()}
                                            </span>
                                        </div>
                                        <div className="ps-0 hideInfoButton d-flex align-items-center"> 
                                            <FontAwesomeIcon 
                                                className={`icon ${Hide ? "hidden" : "shown"}`}
                                                onClick={() => {setHide(!Hide)}}
                                                icon={faEye}
                                            />
                                            <FontAwesomeIcon 
                                                className={`icon ${!Hide ? "hidden" : "shown"}`}
                                                onClick={() => {setHide(!Hide)}}
                                                icon={faEyeSlash}
                                            />
                                            <FontAwesomeIcon 
                                            className="icon placeholder"
                                                icon={faEyeSlash}
                                            />
                                        </div>
                                    </Row>
                                </h1>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    {t("Acquired FeeParts")}:<span className="bolder"> {Fund.shares}</span><br />
                                    {t("FeePart Price (updated")}: {t("Now")}):<span className="bolder"> ${Fund.fund.sharePrice}</span><br />
                                </Card.Text>
                            </Row>
                        </Container>
                    </Row>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button onClick={() => { handleShow() }} className="me-1 button left">
                                <FontAwesomeIcon icon={faIdCard} />
                            </Button>
                        </Col>
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <OverlayTrigger rootClose trigger='click' placement="left-start" overlay={
                                <Popover id="popover-basic" >
                                    <Popover.Header className="mt-0">{t("Fund menu")}</Popover.Header>
                                    <Popover.Body>
                                        Some Action
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={Fund}>
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
export default FundCard