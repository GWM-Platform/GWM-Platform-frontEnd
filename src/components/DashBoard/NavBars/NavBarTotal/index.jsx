import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import { Navbar, Container, Col, Row, Spinner } from 'react-bootstrap';

import './index.css'
import { dashboardContext } from '../../../../context/dashboardContext';

const NavBarTotal = ({ balanceChanged, setBalanceChanged }) => {
    const { t } = useTranslation();

    const [Balance, setBalance] = useState({ fetching: false, value: 0 })

    const { token, ClientSelected, itemSelected,contentReady,Accounts } = useContext(dashboardContext)

    const sectionsCashInAccount = ["buy", "withdraw","sell"]

    useEffect(() => {
        const getAccounts = async () => {
            var url = `${process.env.REACT_APP_APIURL}/clients/${ClientSelected.id}/balance`;
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
                setBalance(prevState => ({ ...prevState, ...{ fetching: false, value: data } }))
            } else {
                switch (response.status) {
                    default:
                }
            }
            setBalanceChanged(false)
        }
        if (balanceChanged && ClientSelected.id) getAccounts()
        // eslint-disable-next-line 
    }, [setBalance, token, balanceChanged, setBalanceChanged, ClientSelected])

    return (
        <Navbar className="navBarTotal" bg="light">
            <Container className="px-0" fluid>
                <Row className="w-100 mx-0 d-flex justify-content-center">
                    <Col className="ps-2 ps-md-2 ps-lg-0" xs="auto">
                        <h1 className="total my-0 py-0 d-flex align-items-center growOpacity">

                            {
                                sectionsCashInAccount.includes(itemSelected)?
                                <>
                                    {t("Cash in account")}:&nbsp;
                                    {
                                        contentReady ?
                                            <span className="growOpacity">${Accounts[0].balance}</span>
                                            :
                                            <Spinner className="ms-2" animation="border" size="sm" />
                                    }
                                </>
                                :
                            <>
                                {t("Total Balance")}
                                {
                                    Balance.fetching ?
                                        <Spinner className="ms-2" animation="border" size="sm" />

                                        :
                                        <span className="growOpacity">{": $" + Balance.value.toFixed(2)}</span>
                                }
                            </>
                            }
                        </h1>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}
export default NavBarTotal



