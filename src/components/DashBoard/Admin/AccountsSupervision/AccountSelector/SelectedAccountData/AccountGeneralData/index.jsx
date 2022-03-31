import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Spinner,Container,Row,Col } from 'react-bootstrap'
const AccountGeneralData = ({ Account, Client }) => {
    const { t } = useTranslation();
    const [balanceTotal, setBalanceTotal] = useState({ fetching: true, fetched: true, value: 0 })
    console.table(Account.balance)
    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getBalance = async () => {
            setBalanceTotal((prevState) => ({ fetching: true, fetched: true, value: 0 }))
            var url = `${process.env.REACT_APP_APIURL}/clients/${Client.id}/balance`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false, value: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }
        getBalance()

    }, [Client])

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>{t("Account general data")}</Accordion.Header>
            <Accordion.Body>
                <Container fluid className="px-0">
                    <Row className="mx-0 w-100">
                        <Col className="ps-0" xs="auto">
                            <h1 className="Info">{t("Owner alias")}: <span className='emphasis'>{Client.alias}</span></h1>
                            <h1 className="Info">{t("Owner first name")}: <span className='emphasis'>{Client.firstName}</span></h1>
                            <h1 className="Info">{t("Owner last name")}: <span className='emphasis'>{Client.lastName}</span></h1>
                        </Col>
                        <Col className="pe-0">
                            <h1 className="totalBalance">{t("Total balance")}:{
                                balanceTotal.fetching ?
                                    <Spinner animation="border" size="sm" />
                                    :
                                    <span className='emphasis'>{"$" + balanceTotal.value}</span>
                            }
                            </h1>
                            <h1 className="Info text-end">{t("Cash balance")}: <span className='emphasis'>${Account.balance}</span></h1>
                        </Col>
                    </Row>
                </Container>
            </Accordion.Body>
        </Accordion.Item >
    )
}

export default AccountGeneralData