import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom';
import './index.css'
import { dashboardContext } from '../../../../../../context/dashboardContext';

const CashCard = ({ Hide, setHide, Fund, PendingTransactions }) => {
    const { t } = useTranslation();
    const { token, ClientSelected } = useContext(dashboardContext)

    const [PendingMovements, setPendingMovements] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )
    const [PendingCash, setPendingCash] = useState(0)

    let history = useHistory();

    const toWithdraw = (type) => {
        history.push(`/dashboard/withdraw`);
    }

    useEffect(() => {
        let PendingMovementsCash = PendingMovements.value.map((movement) => movement.amount).reduce((a, b) => a + b, 0) * -1
        let PendingTransactionsCash = PendingTransactions.value.filter((transaction) => Math.sign(transaction.shares) === -1).map((transaction) => transaction.shares * transaction.sharePrice).reduce((a, b) => a + b, 0)
        setPendingCash((PendingMovementsCash + PendingTransactionsCash).toFixed())
    }, [PendingTransactions, PendingMovements.value])

    useEffect(() => {
        const getPendingMovements = async () => {

            var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams({
                client: ClientSelected.id,
                filterState:1
            });

            setPendingMovements(prevState => ({
                ...prevState,
                ...{
                    fetching: true,
                }
            }))

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
                setPendingMovements(prevState => ({
                    ...prevState,
                    ...{
                        fetching: false,
                        fetched: true,
                        value: data.movements
                    }
                }))

            } else {
                switch (response.status) {
                    default:
                        console.log(response.status)
                        setPendingMovements(prevState => ({
                            ...prevState,
                            ...{
                                fetching: false,
                                fetched: false,
                            }
                        }))
                }
            }
        }
        getPendingMovements()
    }, [token, ClientSelected.id])

    return (
        <Col sm="6" md="6" lg="4" className="fund-col growAnimation">
            <Card className="h-100 cashCard">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        <img className="currency px-0 mx-0" alt="cash" src={process.env.PUBLIC_URL + '/images/cash.svg'} />
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Row >
                        <Card.Title >
                            <h1 className="title mt-0">
                                {t("Current account")}
                            </h1>
                        </Card.Title>

                        <h1 className="title-gray mt-1">
                            <Container fluid className="px-0">
                                <Row className="w-100 mx-0 d-flex justify-content-between gx-0">
                                    <div className="pe-2 containerHideInfo">
                                        <span>$</span>
                                        <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                            {parseFloat(Fund.balance).toString().replace(/./g, "*")}
                                        </span>

                                        <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                            {parseFloat(Fund.balance).toString()}
                                        </span>

                                        <span className={`info placeholder`}>
                                            {parseFloat(Fund.balance).toString()}
                                        </span>
                                    </div>
                                    <div className="ps-0 hideInfoButton d-flex align-items-center">
                                        <FontAwesomeIcon
                                            className={`icon ${Hide ? "hidden" : "shown"}`}
                                            onClick={() => { setHide(!Hide) }}
                                            icon={faEye}
                                        />
                                        <FontAwesomeIcon
                                            className={`icon ${!Hide ? "hidden" : "shown"}`}
                                            onClick={() => { setHide(!Hide) }}
                                            icon={faEyeSlash}
                                        />
                                        <FontAwesomeIcon
                                            className="icon placeholder"
                                            icon={faEyeSlash}
                                        />
                                    </div>
                                </Row>
                            </Container>
                        </h1>
                        <Card.Text className="subTitle lighter mt-0 mb-2">
                            {t("Pending Cash")}:<span className="bolder text-green"> +${Math.abs(PendingCash)}</span><br />
                        </Card.Text>
                    </Row>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="12" className="d-flex justify-content-center p-0 m-0">
                            <Button onClick={() => toWithdraw()} className="button d-flex align-items-center justify-content-center">
                                <span className="label">{t("Withdraw")}</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>


    )
}
export default CashCard