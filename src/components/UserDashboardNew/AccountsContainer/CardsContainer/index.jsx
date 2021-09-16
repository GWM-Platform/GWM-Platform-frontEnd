import React, { useEffect } from 'react'
import { useState } from 'react';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCard from './AccountCard';

const CardsContainer = ({ setItemSelected, accounts }) => {

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
            <Container className="py-5" style={{ width: "70%" }}>
                <Row className="d-flex align-items-center g-5" style={{ minHeight: "70vh" }}>
                    {
                        accounts.map((j, k) => {
                                return (
                                    <AccountCard setItemSelected={setItemSelected} accounts={accounts} account={j}/>
                                )
                            }
                        )
                    }
                </Row>
            </Container>
        </Row>
    )
}
export default CardsContainer
