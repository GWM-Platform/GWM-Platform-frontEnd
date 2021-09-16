import React, { useEffect } from 'react'
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainCard from './MainCard';
import SecondaryCard from './SecondaryCard';
import MobileCard from './MobileCard';

const CardsContainer = ({ setItemSelected,isMobile,accounts, numberOfAccounts }) => {
    const [selected, setSelected] = useState(0)
    const [categorySelected, setCategorySelected] = useState(0)

    

    const clasificateAccounts = (accounts) => {
        let aux = []
        accounts.forEach((u, i) => {
            if (aux[u.type.productLine.description] === undefined) {
                aux[u.type.productLine.description] = []
            }
            aux[u.type.productLine.description] = [...aux[u.type.productLine.description], u]
        })
    }

    useEffect(() => {
        clasificateAccounts(accounts)
        return () => {
        }
    }, [accounts])

    return (
        <Row>
            {isMobile ?
                <Col md="12" lg="4" xl="3" className="secondaryCardContainer ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0">
                    {accounts.map(
                        (j, k) => {
                            ;
                            return (
                                <MobileCard 
                                    setItemSelected={setItemSelected} 
                                    numberOfAccounts={numberOfAccounts} 
                                    setCategorySelected={setCategorySelected} 
                                    setSelected={setSelected} 
                                    parentKey={1}
                                    ownKey={k} 
                                    account={j} 
                                    selected={selected} 
                                    categorySelected={categorySelected} 
                                    accounts={accounts}
                                    display={true}
                                />
                            )
                        }
                    )
                    }
                </Col>
                : (numberOfAccounts <= 1 ?
                    <Col className="px-2 pb-2" xs="12" xl="12" >
                        <MainCard 
                            setItemSelected={setItemSelected} 
                            className={"cardTextMain"} 
                            isMobile={isMobile} 
                            selected={selected} 
                            categorySelected={categorySelected}
                            accounts={accounts} 
                            account={accounts[selected]} />
                    </Col>
                    :
                    <>
                        <Col  className="px-2 " md="12" lg="8" xl="9" >
                            <MainCard setItemSelected={setItemSelected}  numberOfAccounts={numberOfAccounts} selected={selected} categorySelected={categorySelected} accounts={accounts} account={accounts[selected]} />
                        </Col>
                        <Col md="12" lg="4" xl="3" className="secondaryCardContainer mt-0 mt-md-2 mt-lg-0 mt-xl-0 ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0">
                            {accounts.map(
                                (j, k) => {
                                    ;
                                    return (
                                        <SecondaryCard 
                                            accounts={accounts} 
                                            key={k} 
                                            setItemSelected={setItemSelected} 
                                            numberOfAccounts={numberOfAccounts}
                                            setCategorySelected={setCategorySelected} 
                                            setSelected={setSelected} parentKey={1}
                                            ownKey={k} 
                                            account={j} 
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
