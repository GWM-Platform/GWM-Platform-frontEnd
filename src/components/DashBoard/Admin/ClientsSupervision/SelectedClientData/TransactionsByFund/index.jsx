import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Col } from 'react-bootstrap'
import TransactionFundTable from './TransactionFundTable';
import axios from 'axios';
import { useMemo } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import FundSelector from 'components/DashBoard/Admin/APL/FundSelector';
const TransactionsByFund = ({ AccountId, ClientId }) => {
    const { t } = useTranslation();

    const { toLogin } = useContext(DashBoardContext)

    const [FundSelected, setFundSelected] = useState("")

    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: [] }), [])
    const [Funds, setFunds] = useState(initialState)

    useEffect(() => {
        const getFunds = (signal) => {
            axios.get(`/funds`, { signal: signal }).then(function (response) {
                setFunds((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response.data,
                    }))
                setFundSelected(response?.data?.[0]?.id || "")
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") {
                        toLogin()
                    } else {
                        setFunds((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: [],
                            }))
                    }


                }
            });
        }
        getFunds();

        return () => {
            setFunds((prevState) => (
                {
                    ...prevState,
                    initialState
                }))
        }
        //eslint-disable-next-line
    }, [])


    return (
        <Accordion.Item eventKey="4">
            <Accordion.Header>{t("Transactions by fund")}</Accordion.Header>
            <Accordion.Body className='px-0'>
                <Col md="12">
                    <FundSelector SelectedFund={FundSelected} setSelectedFund={setFundSelected} Funds={Funds.content} />
                </Col>

                {
                    FundSelected === "" ? null :
                        <TransactionFundTable AccountId={AccountId} ClientId={ClientId} FundId={FundSelected} />
                }
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default TransactionsByFund