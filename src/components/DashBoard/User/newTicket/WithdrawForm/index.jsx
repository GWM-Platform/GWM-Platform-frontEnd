import React, { useState, useContext, useMemo } from 'react'
import { useHistory } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.scss'

import { Container, Row, Col } from 'react-bootstrap'
import { DashBoardContext } from 'context/DashBoardContext';
import WithdrawData from './WithdrawData'
import Loading from '../Loading';
import ActionConfirmationModal from './ActionConfirmationModal';
import ReactGA from "react-ga4";
import { useEffect } from 'react';
import enrichAccount from 'utils/enrichAccount';
import { customFetch } from 'utils/customFetch';

const WithdrawForm = ({ balanceChanged }) => {

    useEffect(() => {
        ReactGA.event({
            category: "Acceso a secciones para generar tickets",
            action: "Retiros",
            label: "Retiros",
        })
    }, [])

    const [data, setData] = useState({ amount: "", note: "" })
    const [ShowModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(true);
    const [fetching, setFetching] = useState(false)

    const { token, AccountSelected, contentReady } = useContext(DashBoardContext);

    let history = useHistory();


    const withdraw = async () => {
        setFetching(true)
        var url = `${process.env.REACT_APP_APIURL}/accounts/${AccountSelected.id}/withdraw`;
        const response = await customFetch(url, {
            method: 'POST',
            body: JSON.stringify({ amount: parseFloat(data.amount), note: data.note }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            balanceChanged()
            history.push(`/DashBoard/operationResult`);
        } else {
            switch (response.status) {
                case 500:
                    history.push(`/DashBoard/operationResult?result=failed`);
                    break;
                default:
                    history.push(`/DashBoard/operationResult?result=failed`);
            }
        }
        setFetching(false)
    }

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData({ ...data, ...aux });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        const token = sessionStorage.getItem('access_token')
        if (form.checkValidity() === true && !fetching) {
            if (token === null) {
                console.log("compra")
            } else {
                setShowModal(true)
            }
        }
        setValidated(true);
    }

    const AccountSelectedEnriched = useMemo(() =>
        enrichAccount(AccountSelected), [AccountSelected])

    return (
        <div className={`d-flex flex-column h-100`}>
            <Container className="h-100">
                <Row className="newTicket h-100 growAnimation">
                    {
                        !contentReady ?
                            <Loading />
                            :
                            <Col xs="12">
                                <WithdrawData
                                    handleSubmit={handleSubmit} validated={validated}
                                    handleChange={handleChange} data={data} account={AccountSelectedEnriched} fetching={fetching} />
                            </Col>
                    }

                </Row>
            </Container>
            {
                contentReady ?
                    <ActionConfirmationModal fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={withdraw} data={data} Balance={AccountSelectedEnriched.balance} />
                    :
                    null
            }
        </div>
    )
}
export default WithdrawForm