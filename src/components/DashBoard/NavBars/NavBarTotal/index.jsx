import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import { Navbar, Container, Col, Row } from 'react-bootstrap';

import './index.css'

const NavBarTotal = ({ balanceChanged, setBalanceChanged }) => {
    const { t } = useTranslation();
    const [Balance, setBalance] = useState({ fetching: false, value: 0 })
    const token = sessionStorage.getItem('access_token')

    useEffect(() => {
        const getAccounts = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts`;
            setBalance({ ...Balance, ...{ fetching: true } })
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                if (data.length > 0) { setBalance({ ...Balance, ...{ fetching: false, value: data[0].balance } }); getPendingTransactions() }
            } else {
                switch (response.status) {
                    default:
                }
            }
            setBalanceChanged(false)
        }

        const getPendingTransactions = async () => {
            var url = `${process.env.REACT_APP_APIURL}/transactions/states/1/transactions`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                console.log(data)
                getPendingMovements()
            }
        }

        const getPendingMovements = async () => {
            const token = sessionStorage.getItem('access_token')
            var url = `${process.env.REACT_APP_APIURL}/accounts/movements/bystate/1`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                console.log(data)
                getFunds()
            } 
        }

        const getFunds = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds/stakes`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                console.log(data)
            }
        }

        if (balanceChanged) getAccounts()
        // eslint-disable-next-line 
    }, [setBalance, token, balanceChanged, setBalanceChanged])

    return (
        <Navbar className="navBarTotal" bg="light">
            <Container className="px-0" fluid>
                <Row className="w-100 mx-0">
                    <Col className="ps-2 ps-md-2 ps-lg-0" md={{ spant: "auto", offset: 0 }} lg={{ span: "auto", offset: 2 }}>
                        <h1 className="total my-0 py-0"> {t("Total Balance")}: ${Balance.value}</h1>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}
export default NavBarTotal



