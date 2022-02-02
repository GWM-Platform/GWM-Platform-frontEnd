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
            var url = `${process.env.REACT_APP_APIURL}/clients/me/balance`;
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
                setBalance(prevState=>({ ...prevState, ...{ fetching: false, value: data } }))
            } else {
                switch (response.status) {
                    default:
                }
            }
            setBalanceChanged(false)
        }

        if (balanceChanged) getAccounts()
        // eslint-disable-next-line 
    }, [setBalance, token, balanceChanged, setBalanceChanged])

    return (
        <Navbar className="navBarTotal" bg="light">
            <Container className="px-0" fluid>
                <Row className="w-100 mx-0 d-flex justify-content-center">
                    <Col className="ps-2 ps-md-2 ps-lg-0" lg="auto">
                        <h1 className="total my-0 py-0"> {t("Total Balance")}: ${Balance.value.toFixed(2)}</h1>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}
export default NavBarTotal



