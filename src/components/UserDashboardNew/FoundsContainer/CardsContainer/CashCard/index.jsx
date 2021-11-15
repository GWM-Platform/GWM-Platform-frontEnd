import React from 'react'
import { Row, Col, Card, Button,Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import './index.css'

const CashCard = ({ Hide,setHide,handleSwitch,SwitchState,found }) => {
    const { t } = useTranslation();

    return (
        <Col sm="6" md="6" lg="4" className="fund-col">
            <Card className="h-100 cashCard">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        <img className="currency px-0 mx-0" alt={found.type} src={process.env.PUBLIC_URL + '/images/' + found.type + '.svg'} />
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Form.Check
                        onChange={handleSwitch}
                        checked={SwitchState}
                        type="switch"
                        id="foundApi"
                        label={t("API's founds (For devops)")}
                    />
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
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button className="me-1 button left d-flex align-items-center justify-content-center">
                                <span className="label">Deposit</span>
                            </Button>
                        </Col>
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button className="ms-1 button right d-flex align-items-center justify-content-center">
                                <span className="label">Withdraw</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>


    )
}
export default CashCard