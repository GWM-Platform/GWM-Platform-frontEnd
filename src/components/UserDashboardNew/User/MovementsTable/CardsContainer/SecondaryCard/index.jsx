import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse, Container, Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useRef } from 'react'
import './index.css'
//Parent key 0-> Fund;Parent key 1->Cash
const SecondaryCard = ({ Fund, setCategorySelected, setSelected, parentKey, ownKey, selected, Hide,categorySelected }) => {
    const select = () => {
        setCategorySelected(parentKey)
        setSelected(ownKey)
    }

    const ref = useRef(null)

    const { t } = useTranslation();
    const balanceInCash=parentKey===1 ? (Fund.shares * Fund.fund.sharePrice) : Fund.balance 

    return (
        <Collapse in={categorySelected!==parentKey || (selected!==ownKey && categorySelected===parentKey )} className="pt-0 pb-2">
            <Container ref={ref} >
                <Row className="secondaryCard" onClick={select}>
                    <Col sm="4" lg="auto" className="d-none d-sm-none d-md-none d-lg-flex currencyCol d-flex align-items-center">
                        <div className="currencyContainer d-flex align-items-center justify-content-center">
                            {
                                parentKey === 1 ?
                                    Fund.fund.type !== undefined ?
                                        <img className="currency px-0 mx-0" alt={Fund.fund.type} src={process.env.PUBLIC_URL + '/images/' + Fund.fund.type + '.svg'} />
                                        :
                                        <img className="currency px-0 mx-0" alt="crypto" src={process.env.PUBLIC_URL + '/images/crypto.svg'} />
                                    :
                                    <img className="currency px-0 mx-0" alt="crypto" src={process.env.PUBLIC_URL + '/images/cash.svg'} />
                            }
                        </div>
                    </Col>
                    <Col sm="12" md="12" lg="8" className="secondary d-flex align-items-start flex-column" >
                        <div className="mb-auto mt-2">
                            <h1 className="description mt-0 pt-0">
                                {t(parentKey === 1 ? Fund.fund.name : "Cash")}
                            </h1>
                        </div>
                        <div className="mb-2">
                            <h2 className="funds">
                                <div className="containerHideInfo">
                                    <span style={{ fontWeight: "bolder" }}>
                                        $
                                    </span>
                                    <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                        {balanceInCash.toString().replace(/./g, "*")}
                                    </span>

                                    <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                        {balanceInCash.toString()}
                                    </span>

                                    <span className={`info placeholder`}>
                                        {balanceInCash.toString()}
                                    </span>
                                </div>
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
