import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlash, faEyeSlash, faEye, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle,faClipboard } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';
import './index.css'
import { DashBoardContext } from 'context/DashBoardContext';

const CashCard = ({ Hide, setHide, Fund, PendingTransactions, Pinned, setPinned, cardsAmount, inScreenFunds }) => {
    const { t } = useTranslation();

    const { token, ClientSelected, DashboardToastDispatch,isMobile } = useContext(DashBoardContext)

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
        history.push(`/DashBoard/withdraw`);
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
                filterState: 1
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
                        value: data.movements ? data.movements : []
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
        <>
            <Col sm="6" md="6" lg="4" className={`fund-col  growAnimation ${Pinned && !isMobile ? "opacity-0" : ""}`}>
                <Card className="h-100 cashCard">
                    <Card.Header
                        className="header d-flex align-items-center justify-content-center"
                    >
                        <div className="currencyContainer d-flex align-items-center justify-content-center">
                            <img className="currency px-0 mx-0" alt="cash" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                        </div>
                    </Card.Header>
                    <Card.Body className="body">
                        <Row >
                            <Card.Title >
                                <Container fluid className="px-0">
                                    <Row className="mx-0 w-100">
                                        <Col className="ps-0">
                                            <h1 className="title mt-0">
                                                {t("Cash")}
                                            </h1>
                                        </Col>
                                        {cardsAmount > inScreenFunds && !isMobile ?
                                            <div className="px-0 hideInfoButton d-flex align-items-center" onClick={() => { setPinned(true) }}                                            >
                                                <FontAwesomeIcon
                                                    className={`icon pin`}
                                                    icon={faThumbtack}
                                                />
                                                <FontAwesomeIcon
                                                    className="icon placeholder"
                                                    icon={faEyeSlash}
                                                />
                                            </div>
                                            :
                                            null}

                                    </Row>
                                </Container>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    {t("Alias")}: <span className="bolder">{Fund.alias}</span>
                                    <button style={{ color: "var(--bs-body-color)" }} className="noStyle float-end">
                                        <FontAwesomeIcon className="ms-1 clipboardIcon" icon={faClipboard}
                                            onClick={() => {
                                                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Alias succesfully copied!" } });
                                                navigator.clipboard.writeText(Fund.alias)
                                            }} />
                                    </button>
                                    <br />
                                </Card.Text>
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
            {
                Pinned && !isMobile?
                    <Col sm="6" md="6" lg="4" className="fund-col pinned">
                        <Card className="h-100 cashCard">
                            <Card.Header
                                className="header d-flex align-items-center justify-content-center"
                            >
                                <div className="currencyContainer d-flex align-items-center justify-content-center">
                                    <img className="currency px-0 mx-0" alt="cash" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                                </div>
                            </Card.Header>
                            <Card.Body className="body">
                                <Row >
                                    <Card.Title >
                                        <Container fluid className="px-0">
                                            <Row className="mx-0 w-100">
                                                <Col className="ps-0">
                                                    <h1 className="title mt-0">
                                                        {t("Cash")}
                                                    </h1>
                                                </Col>


                                                <div className="px-0 hideInfoButton d-flex align-items-center" onClick={() => { setPinned(false) }}>
                                                    <FontAwesomeIcon
                                                        className={`icon pin ${Pinned ? "active" : ""}`}
                                                        mask={faThumbtack}
                                                        icon={faSlash}
                                                        transform="down-2"
                                                    />
                                                    <FontAwesomeIcon
                                                        className={`icon pin`}
                                                        icon={faSlash}
                                                    />
                                                    <FontAwesomeIcon
                                                        className="icon placeholder"
                                                        icon={faEyeSlash}
                                                    />
                                                    <div className="line"></div>
                                                </div>
                                            </Row>
                                        </Container>
                                        <Card.Text className="subTitle lighter mt-0 mb-2">
                                    {t("Alias")}: <span className="bolder">{Fund.alias}</span>
                                    <button style={{ color: "var(--bs-body-color)" }} className="noStyle float-end">
                                        <FontAwesomeIcon className="ms-1 clipboardIcon" icon={faClipboard}
                                            onClick={() => {
                                                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Alias succesfully copied!" } });
                                                navigator.clipboard.writeText(Fund.alias)
                                            }} />
                                    </button>
                                    <br />
                                </Card.Text>
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
                    :
                    null
            }

        </>


    )
}
export default CashCard