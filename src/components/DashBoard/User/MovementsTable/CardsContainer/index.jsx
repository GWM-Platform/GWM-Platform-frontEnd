import React, { useEffect } from 'react'
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import MainCardFund from './MainCard/MainCardFund';
import MainCardAccount from './MainCard/MainCardAccount';

import SecondaryCard from './SecondaryCard';
import MobileCardFound from './MobileCards/MobileCardFound';
import MobileCardAccount from './MobileCards/MobileCardAccount';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import './index.css'

const CardsContainer = ({ setItemSelected, isMobile, Funds, numberOfFunds, selected, setSelected, NavInfoToggled, Accounts }) => {
    const [categorySelected, setCategorySelected] = useState(Accounts.length > 0 ? 0 : Funds.length > 0 ? 1 : 0)
    const [Hide, setHide] = useState(false)
    const [collapseSecondary, setCollapseSecondary] = useState(false)

    const { t } = useTranslation();

    useEffect(() => {
        if (numberOfFunds > 0) {
            if (Accounts.length > 0) { setCategorySelected(0) } else { if (Funds.length > 0) setCategorySelected(1) }
        }
    }, [Accounts, Funds, numberOfFunds])

    return (
        <Row className="HistoryCardsContainer d-flex flex-md-nowrap ">
            {isMobile ?
                Accounts.length > 1 || Funds.length > 1 ?
                    <>
                        <Col md="12" className="ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0 growAnimation" >
                            {Accounts.map(
                                (j, k) => {
                                    ;
                                    return (
                                        <MobileCardAccount Fund={j} />
                                    )
                                }
                            )}
                            {Funds.map(
                                (j, k) => {
                                    ;
                                    return (
                                        <MobileCardFound Fund={j} />
                                    )
                                }
                            )}
                        </Col>
                    </>
                    :
                    <Col className="h-100">
                        <h1>{t("Your user doesn't have any account")}</h1>
                    </Col>
                :
                numberOfFunds > 1 ?
                    <>
                        <Col className="px-2 p-relative mainCardCol growAnimation"
                            md="12"
                            lg={collapseSecondary ? "12" : "8"}
                            xl={collapseSecondary ? "12" : "9"} >
                            {
                                categorySelected === 1 ?
                                    <MainCardFund
                                        Fund={Funds[selected]}
                                        Hide={Hide} setHide={setHide}
                                        NavInfoToggled={NavInfoToggled}
                                    />
                                    :
                                    <MainCardAccount
                                        Fund={Accounts[selected]}
                                        Hide={Hide} setHide={setHide}
                                        NavInfoToggled={NavInfoToggled}
                                    />
                            }
                            <div className={`d-none d-sm-block collapser ${collapseSecondary ? "expanded" : "collapsed"}`}
                                onClick={() => { setCollapseSecondary(!collapseSecondary) }}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </Col>
                        <Col sm="4" md="4" lg="4" xl="3"
                            className={
                                `secondaryCardContainer growAnimation
                                ${NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}
                                ${collapseSecondary ? "collapsed" : "expanded"} p-relative px-0 pe-2 pt-0`
                            }>
                            {
                                Accounts.length > 0 ?
                                    <div className="CategoryLabel">
                                        <h1 className="title">{t("Cash")}</h1>
                                    </div>
                                    :
                                    null
                            }
                            {Accounts.map(
                                (Account, key) => {
                                    ;
                                    return (
                                        <SecondaryCard
                                            Hide={Hide}
                                            Fund={Account}
                                            categorySelected={categorySelected} setCategorySelected={setCategorySelected}
                                            selected={selected} setSelected={setSelected}
                                            parentKey={0} ownKey={key} key={key}
                                        />
                                    )
                                }
                            )
                            }
                            {
                                Funds.length > 0 ?
                                    <div className="CategoryLabel">
                                        <h1 className="title">{t("Funds")}</h1>
                                    </div>
                                    :
                                    null}
                            {Funds.map(
                                (Fund, key) => {
                                    ;
                                    return (
                                        <SecondaryCard
                                            Hide={Hide}
                                            Fund={Fund}
                                            categorySelected={categorySelected} setCategorySelected={setCategorySelected}
                                            selected={selected} setSelected={setSelected}
                                            parentKey={1} ownKey={key} key={key}
                                        />
                                    )
                                }
                            )}
                        </Col>
                    </>
                    :
                    (numberOfFunds === 1 ?
                        <Col className="px-2 pb-2 growAnimation" xs="12" xl="12" >
                            {Accounts.length === 1 ?
                                <MainCardAccount
                                    Fund={Accounts[0]}
                                    Hide={Hide} setHide={setHide}
                                    NavInfoToggled={NavInfoToggled}
                                />
                                :
                                <MainCardFund
                                    Fund={Funds[0]}
                                    Hide={Hide} setHide={setHide}
                                    NavInfoToggled={NavInfoToggled}
                                />
                            }
                        </Col>
                        :
                        null
                    )}
        </Row>
    )
}
export default CardsContainer
