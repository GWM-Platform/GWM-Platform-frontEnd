import React from 'react'
import { useState } from 'react';
import { Container,Row, Col, Card, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faIdCard, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import ChangeNameModal from './ChangeNameModal'

const FoundCard = ({ Hide, setHide, switchState, found, founds, setItemSelected }) => {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { t } = useTranslation();

    return (
        <Col className="fund-col" sm="6" md="6" lg="4">
            <Card className="foundCard h-100">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        {
                            found.fund.type !== undefined ?
                                <img className="currency px-0 mx-0" alt={found.fund.type} src={process.env.PUBLIC_URL + '/images/' + found.fund.type + '.svg'} />
                                :
                                <img className="currency px-0 mx-0" alt="crypto" src={process.env.PUBLIC_URL + '/images/crypto.svg'} />
                        }
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Row className="h-100 align-content-between">
                        <Card.Title >
                            <h1 className="title mt-0">
                                {t(found.fund.name)}
                            </h1>
                        </Card.Title>
                        <Container>
                            <Row className="d-flex justify-content-between">
                                <h1 className="title mt-1">
                                    <Row className="d-flex justify-content-between">
                                        <div className="pe-0" style={{ width: "auto" }}>
                                            <span>$</span>
                                            {Hide ? (found.shares * found.fund.sharePrice).toString().replace(/./g, "*") : found.shares * found.fund.sharePrice}
                                        </div>
                                        <div className="ps-0" style={{ width: "auto",cursor:"pointer" }}>
                                            <FontAwesomeIcon style={{ width: "25px" }}
                                                onClick={() => {
                                                    setHide(!Hide)
                                                }}
                                                icon={Hide ? faEyeSlash : faEye}
                                            />
                                        </div>
                                    </Row>
                                </h1>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    Acquired FeeParts:<span className="bolder"> {found.shares}</span><br />
                                    FeePart Price:<span className="bolder"> ${found.fund.sharePrice}</span><br />
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
                                    <Popover.Header className="mt-0">{t("found menu")}</Popover.Header>
                                    <Popover.Body>
                                        Some Action
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