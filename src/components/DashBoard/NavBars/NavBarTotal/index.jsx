import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import { Navbar, Container, Col, Row, Spinner } from 'react-bootstrap';

import './index.css'
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const NavBarTotal = ({ balanceChanged, setBalanceChanged }) => {
    const { t } = useTranslation();

    const [Balance, setBalance] = useState({ fetching: false, value: 0 })

    const { token, ClientSelected, itemSelected, contentReady, Accounts, hasPermission } = useContext(DashBoardContext)

    const sectionsCashInAccount = ["buy", "withdraw", "sell", "transfer", "timedeposit"]

    useEffect(() => {
        const getBalance = async () => {
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
        if (balanceChanged && ClientSelected.id) getBalance()
        // eslint-disable-next-line 
    }, [setBalance, token, balanceChanged, setBalanceChanged, ClientSelected])

    return (
        <Navbar className="navBarTotal" bg="light">
            <Container className="px-0" fluid>
                <Row className="w-100 mx-0 d-flex justify-content-center">
                    <Col className="ps-2 ps-md-2 ps-lg-0" xs="auto">
                        <h1 className="total my-0 py-0 d-flex align-items-center growOpacity">

                            {
                                sectionsCashInAccount.includes(itemSelected.toLowerCase()) && hasPermission("VIEW_ACCOUNT") ?
                                    <>
                                        {t("Available cash")}:&nbsp;
                                        {
                                            contentReady && Accounts[0] ?
                                                <FormattedNumber className="growOpacity" value={Accounts[0].balance} prefix="$" fixedDecimals={2} />
                                                :
                                                <Spinner className="ms-2" animation="border" size="sm" />
                                        }
                                    </>
                                    :
                                    <>
                                        {t("Total balance")}:&nbsp;
                                        {
                                            Balance.fetching ?
                                                <Spinner className="ms-2" animation="border" size="sm" />

                                                :
                                                <FormattedNumber className="growOpacity" value={Balance.value} prefix="$" fixedDecimals={2} />
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



