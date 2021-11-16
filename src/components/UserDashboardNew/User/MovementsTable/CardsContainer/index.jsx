import React from 'react'
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainCard from './MainCard';
import SecondaryCard from './SecondaryCard';
import MobileCard from './MobileCard';

const CardsContainer = ({ SwitchState,setItemSelected,isMobile,Funds, numberOfFunds }) => {
    const [selected, setSelected] = useState(0)
    const [categorySelected, setCategorySelected] = useState(0)

    return (
        <Row>
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
                : (numberOfFunds <= 1 ?
                    <Col className="px-2 pb-2" xs="12" xl="12" >
                        <MainCard 
                            setItemSelected={setItemSelected} 
                            className={"cardTextMain"} 
                            isMobile={isMobile} 
                            selected={selected} 
                            categorySelected={categorySelected}
                            Funds={Funds} 
                            Fund={Funds[selected]} />
                    </Col>
                    :
                    <>
                        <Col  className="px-2 " md="12" lg="8" xl="9" >
                            <MainCard SwitchState={SwitchState} setItemSelected={setItemSelected}  numberOfFunds={numberOfFunds} selected={selected} categorySelected={categorySelected} Funds={Funds} Fund={Funds[selected]} />
                        </Col>
                        <Col md="12" lg="4" xl="3" className="secondaryCardContainer mt-0 mt-md-2 mt-lg-0 mt-xl-0 ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0">
                            {Funds.map(
                                (j, k) => {
                                    ;
                                    return (
                                        <SecondaryCard 
                                            Funds={Funds} 
                                            key={k} 
                                            setItemSelected={setItemSelected} 
                                            numberOfFunds={numberOfFunds}
                                            setCategorySelected={setCategorySelected} 
                                            setSelected={setSelected} parentKey={1}
                                            ownKey={k} 
                                            Fund={j} 
                                            selected={selected} 
                                            categorySelected={categorySelected}
                                            display={k === selected ? false : true}
                                        />
                                    )
                                }
                            )
                            }
                        </Col>
                    </>
                )}
        </Row>
    )
}
export default CardsContainer
