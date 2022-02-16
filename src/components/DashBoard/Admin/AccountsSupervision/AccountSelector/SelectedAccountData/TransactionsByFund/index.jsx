import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Form } from 'react-bootstrap'
import TransactionFundTable from './TransactionFundTable';
const TransactionsByFund = ({ stakes, transactions }) => {
    const { t } = useTranslation();
    const [FundSelected, setFundSelected] = useState("")
    const [transactionsFundSelected, setTransactionsFundSelected] = useState([])

    const handleChange = (event) => {
        setFundSelected(event.target.value)
        setTransactionsFundSelected([])
    }

    useEffect(() => {
        if (FundSelected !== "") {
            setTransactionsFundSelected(transactions.filter((transaction) => transaction.fundId === stakes[FundSelected].fund.id))
        }
    }, [FundSelected, transactions, stakes])

    return (
        <Accordion.Item eventKey="4">
            <Accordion.Header>{t("Transactions by fund")}</Accordion.Header>
            <Accordion.Body>
                <Form.Select onChange={handleChange} value={FundSelected} aria-label="Default select example">
                    <option value="" disabled>{t("Open this select menu")}</option>
                    {stakes.map(
                        (stake, key) => {
                            return <option key={key} value={key}>{stake.fund.name}</option>
                        }
                    )}
                </Form.Select>
                {
                    FundSelected === "" ? null :
                        <TransactionFundTable transactions={transactionsFundSelected} />
                }
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default TransactionsByFund