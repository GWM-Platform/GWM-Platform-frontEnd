import React from 'react'
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainCardFund from './MainCard/MainCardFund';
import MainCardAccount from './MainCard/MainCardAccount';

import SecondaryCard from './SecondaryCard';
import MobileCard from './MobileCard';

const CardsContainer = ({ SwitchState, setItemSelected, isMobile, Funds, numberOfFunds, selected, setSelected, NavInfoToggled, Accounts }) => {
    const [categorySelected, setCategorySelected] = useState(0)
    const [Hide, setHide] = useState(false)

    return (
        <Row >
            {isMobile ?
                <Col md="12" lg="4" xl="3" className="secondaryCardContainer ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0">
                    {Funds.map(
                        (j, k) => {
                            ;
                            return (
                                <MobileCard
                                    setItemSelected={setItemSelected}
                                    numberOfFunds={numberOfFunds}
                                    setCategorySelected={setCategorySelected}
                                    setSelected={setSelected}
                                    parentKey={1}
                                    ownKey={k}
                                    Fund={j}
                                    selected={selected}
                                    categorySelected={categorySelected}
                                    Funds={Funds}
                                    display={true}
                                />
                            )
                        }
                    )
                    }
                </Col>
                :
                numberOfFunds > 1 ?
                    <>
                        <Col className="px-2 " md="12" lg="8" xl="9" >
                            {
                                categorySelected === 0 ?
                                <MainCardFund
                                    Fund={Funds[selected]}
                                    Hide={Hide} setHide={setHide}
                                    NavInfoToggled={NavInfoToggled} SwitchState={SwitchState}
                                />
                                :
                                <MainCardAccount
                                    Fund={Accounts[selected]}
                                    Hide={Hide} setHide={setHide}
                                    NavInfoToggled={NavInfoToggled} SwitchState={SwitchState}
                                />
                            }


                        </Col>
                        <Col md="12" lg="4" xl="3" className="secondaryCardContainer mt-0 mt-md-2 mt-lg-0 mt-xl-0 ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0">
                            {Funds.map(
                                (Fund, key) => {
                                    ;
                                    return (
                                        <SecondaryCard
                                            Hide={Hide}
                                            Fund={Fund}
                                            categorySelected={categorySelected} setCategorySelected={setCategorySelected}
                                            selected={selected} setSelected={setSelected}
                                            parentKey={0} ownKey={key} key={key}
                                        />
                                    )
                                }
                            )
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
                                            parentKey={1} ownKey={key} key={key}
                                        />
                                    )
                                }
                            )
                            }
                        </Col>
                    </>
                    :
                    (numberOfFunds === 1 ?
                        <Col className="px-2 pb-2" xs="12" xl="12" >
                            <MainCardFund
                                 Fund={Funds[selected]}
                                 Hide={Hide} setHide={setHide}
                                 NavInfoToggled={NavInfoToggled} SwitchState={SwitchState}
                            />
                        </Col>
                        :
                        null
                    )}
        </Row>
    )
}
export default CardsContainer
