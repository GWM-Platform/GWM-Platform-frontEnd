import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse, Container, Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useRef } from 'react'
import './index.css'

const SecondaryCard = ({ Found, setCategorySelected, setSelected, parentKey, ownKey, display }) => {
    const select = () => {
        setCategorySelected(parentKey)
        setSelected(ownKey)
    }

    const ref = useRef(null)

    const { t } = useTranslation();

    return (
        <Collapse in={display} className="pt-0 pb-2">
            <Container  ref={ref} >
                <Row className="secondaryCard" onClick={select}>
                    <Col sm="4" lg="auto" className="d-none d-sm-none d-md-block currencyCol d-flex align-items-center">
                        <div className="currencyContainer d-flex align-items-center justify-content-center">
                            <h1 className="currency m-0">
                                {Found.currency.symbol}
                            </h1>
                        </div>
                    </Col>
                    <Col sm="12" md="8" className="secondary d-flex align-items-start flex-column" >
                        <div className="mb-auto mt-2">
                            <h1 className="description mt-0 pt-0">
                                {t(Found.description)}
                            </h1>
                        </div>
                        <div className="mb-2">
                            <h2 className="funds">
                                <span style={{ fontWeight: "bolder" }}>
                                    {Found.currency.symbol}
                                </span>
                                {parseFloat(Found.balance).toFixed(Found.currency.decimals)}
                            </h2>
                            <span className="funds-description">{t("Balance")}</span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Collapse>
    )
}
export default SecondaryCard