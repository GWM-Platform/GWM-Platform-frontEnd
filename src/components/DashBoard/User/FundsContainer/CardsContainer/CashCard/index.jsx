import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card, Button, Spinner, OverlayTrigger, Popover } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlash, faEyeSlash, faEye, faThumbtack, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faClipboard } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';
import './index.css'
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js'

const CashCard = ({ Hide, setHide, Fund, PendingTransactions, Pinned, setPinned, cardsAmount, inScreenFunds }) => {
    const { t } = useTranslation();

    const { token, ClientSelected, DashboardToastDispatch, isMobile } = useContext(DashBoardContext)

    const [PendingMovements, setPendingMovements] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )
    const [PendingTransfers, setPendingTransfers] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )

    const [show, setShow] = useState(false);

    let history = useHistory();

    const toWithdraw = (type) => {
        history.push(`/DashBoard/withdraw`);
    }

    const pendingCash = () => {
        if (PendingMovements.fetched && PendingTransactions.fetched && PendingTransfers.fetched && !(PendingMovements.fetching || PendingTransactions.fetching || PendingTransfers.fetching)) {

            //Solo las ventas, las compras se ven reflejadas en el pendiente de cada fondo como cuotapartes
            const PendingSales = PendingTransactions.value.filter((transaction) => Math.sign(transaction.shares) === -1)
            const pendingCashFromTransactions = PendingSales.map(
                (transaction) => new Decimal(transaction.shares).abs().times(transaction.sharePrice)
            ).reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            //Retiros unicamente, compra y venta se ven reflejados en otro lado
            const PendingWithdrawals = PendingMovements.value.filter((movement) => movement.motive === "WITHDRAWAL")
            const pendingCashFromWithdrawals = PendingWithdrawals.map((movement) => new Decimal(movement.amount))
                .reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            //Depositos unicamente, compra y venta se ven reflejados en otro lado
            const PendingDeposits = PendingMovements.value.filter((movement) => movement.motive === "DEPOSIT")
            const pendingCashFromDeposits = PendingDeposits.map((movement) => new Decimal(movement.amount))
                .reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            //Transferencias
            const PendingSentAndReceivedTransfers = PendingTransfers.value
            const clientId = ClientSelected?.id
            const pendingCashFromTransfers = PendingSentAndReceivedTransfers.map((transfer) => {
                const amount = new Decimal(transfer.amount)
                return (
                    transfer.senderId === clientId && amount.isPositive() ? amount.negated() : amount
                )
            }).reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            const total = (new Decimal(pendingCashFromTransactions).add(pendingCashFromWithdrawals).add(pendingCashFromDeposits).add(pendingCashFromTransfers))
            return {
                valueAbs: total.abs().toFixed(2).toString(),
                isPositive: total.isPositive(),
                calculated: true,
                overView: {
                    Transactions: {
                        valueAbs: new Decimal(pendingCashFromTransactions).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromTransactions).isPositive(),
                    },
                    Withdrawals: {
                        valueAbs: new Decimal(pendingCashFromWithdrawals).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromWithdrawals).isPositive(),
                    },
                    Deposits: {
                        valueAbs: new Decimal(pendingCashFromDeposits).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromDeposits).isPositive(),
                    },
                    Transfers: {
                        valueAbs: new Decimal(pendingCashFromTransfers).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromTransfers).isPositive(),
                    }
                }
            }
        } else {
            return {
                valueAbs: "0.00",
                calculated: false
            }
        }
    }

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
        const getPendingTransfers = async () => {
            var url = `${process.env.REACT_APP_APIURL}/transfers/?` + new URLSearchParams({
                client: ClientSelected.id,
                filterState: 1
            });

            setPendingTransfers(prevState => ({
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
                setPendingTransfers(prevState => ({
                    ...prevState,
                    ...{
                        fetching: false,
                        fetched: true,
                        value: data.transfers ? data.transfers : []
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
        getPendingTransfers()
    }, [token, ClientSelected.id])



    return (
        <>
            <Col sm="6" md="6" lg="4" className={`fund-col  growAnimation ${Pinned && !isMobile ? "opacity-0" : ""}`}>
                <Card className="h-100 cashCard">
                    <Card.Header
                        className="header d-flex align-items-center justify-content-center"
                    >
                        <span className="currencyContainer d-flex align-items-center justify-content-center">
                            <img className="currency px-0 mx-0" alt="cash" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                        </span>
                    </Card.Header>
                    <Card.Body className="body">
                        <Row >
                            <Card.Title >
                                <Container fluid className="px-0">
                                    <Row className="mx-0 w-100 mb-2">
                                        <Col className="ps-0">
                                            <h1 className="title my-0">
                                                {t("Cash")}
                                            </h1>
                                        </Col>
                                        {
                                            !!(cardsAmount > inScreenFunds && !isMobile) &&
                                            <button className="noStyle px-0 hideInfoButton d-flex align-items-center" onClick={() => { setPinned(true); setShow(false) }}                                            >
                                                <FontAwesomeIcon
                                                    className="icon pin"
                                                    icon={faThumbtack}
                                                />
                                                <FontAwesomeIcon
                                                    className="icon placeholder"
                                                    icon={faEyeSlash}
                                                />
                                            </button>
                                        }
                                    </Row>
                                </Container>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    <span className='d-flex justify-content-between'>
                                        <span>
                                            {t("Alias")}: <span className="bolder">{Fund.alias}</span>
                                        </span>
                                        <button className="noStyle px-0 hideInfoButton d-inline-flex align-items-center" onClick={() => {
                                            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Alias succesfully copied!" } });
                                            navigator.clipboard.writeText(Fund.alias)
                                        }}>
                                            <FontAwesomeIcon className="icon pin" icon={faClipboard} />
                                            <FontAwesomeIcon
                                                className="icon placeholder"
                                                icon={faEyeSlash}
                                            />
                                        </button>
                                    </span>
                                </Card.Text>
                            </Card.Title>
                            <h1 className="title-gray mt-1">
                                <Container fluid className="px-0">
                                    <Row className="w-100 mx-0 d-flex justify-content-between gx-0">
                                        <span className="pe-2 containerHideInfo">
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
                                        </span>
                                        <button onClick={() => setHide(prevState => !prevState)} className="noStyle ps-0 hideInfoButton d-flex align-items-center">
                                            <FontAwesomeIcon
                                                className={`icon ${Hide ? "hidden" : "shown"}`}
                                                icon={faEye}
                                            />
                                            <FontAwesomeIcon
                                                className={`icon ${!Hide ? "hidden" : "shown"}`}
                                                icon={faEyeSlash}
                                            />
                                            <FontAwesomeIcon
                                                className="icon placeholder"
                                                icon={faEyeSlash}
                                            />
                                        </button>
                                    </Row>
                                </Container>
                            </h1>
                            <div className="subTitle lighter mt-0 mb-2">
                                <span className='invisible'>{t("Balance (shares)")}:<span className="bolder"></span></span> <br />
                                <span className='d-flex justify-content-between'>
                                    {
                                        pendingCash().calculated ?
                                            <>
                                                <span>{t("Pending transactions")}:<span className={`bolder ${pendingCash().isPositive ? "text-green" : "text-red"}`}>
                                                    &nbsp;{pendingCash().isPositive ? "+" : "-"}${pendingCash().valueAbs}</span>
                                                </span>
                                                <OverlayTrigger show={show} trigger="click" placement="auto" overlay={
                                                    <Popover id="popover-overview-cash" style={{ maxWidth: "unset" }}>
                                                        <Popover.Header>{t("Overview of pending transactions")}</Popover.Header>
                                                        <Popover.Body className="pt-1 pb-2">
                                                            {t("Pending share sales")}:&nbsp;
                                                            <span className={`bolder ${pendingCash().overView.Transactions.isPositive ? "text-green" : "text-red"}`}>
                                                                {pendingCash().overView.Transactions.isPositive ? "+" : "-"}${pendingCash().overView.Transactions.valueAbs}
                                                            </span><br />
                                                            {t("Pending withdrawals")}:&nbsp;
                                                            <span className={`bolder ${pendingCash().overView.Withdrawals.isPositive ? "text-green" : "text-red"}`}>
                                                                {pendingCash().overView.Withdrawals.isPositive ? "+" : "-"}${pendingCash().overView.Withdrawals.valueAbs}
                                                            </span><br />
                                                            {t("Pending deposits")}:&nbsp;
                                                            <span className={`bolder ${pendingCash().overView.Deposits.isPositive ? "text-green" : "text-red"}`}>
                                                                {pendingCash().overView.Deposits.isPositive ? "+" : "-"}${pendingCash().overView.Deposits.valueAbs}
                                                            </span><br />
                                                            {t("Pending transfers")}:&nbsp;
                                                            <span className={`bolder ${pendingCash().overView.Transfers.isPositive ? "text-green" : "text-red"}`}>
                                                                {pendingCash().overView.Transfers.isPositive ? "+" : "-"}${pendingCash().overView.Transfers.valueAbs}
                                                            </span><br />
                                                            {t("Pending total")}:&nbsp;
                                                            <span className={`bolder ${pendingCash().isPositive ? "text-green" : "text-red"}`}>
                                                                &nbsp;{pendingCash().isPositive ? "+" : "-"}${pendingCash().valueAbs}
                                                            </span>
                                                        </Popover.Body>
                                                    </Popover>
                                                }>
                                                    <button  onBlur={()=>setShow(false)}  onClick={() => setShow(prevState => !prevState)}
                                                        className="noStyle px-0 hideInfoButton d-inline-flex align-items-center">
                                                        <FontAwesomeIcon className="icon pin" icon={faInfoCircle} />
                                                        <FontAwesomeIcon
                                                            className="icon placeholder"
                                                            icon={faEyeSlash}
                                                        />
                                                    </button>
                                                </OverlayTrigger>
                                            </>
                                            :
                                            <>
                                                {t("Pending transactions")}:<span className={`bolder text-green`}>&nbsp;<Spinner className="ms-2" animation="border" size="sm" /></span>
                                            </>
                                    }
                                </span>
                            </div>
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
                !!(Pinned && !isMobile) &&
                <Col sm="6" md="6" lg="4" className="fund-col pinned">
                    <Card className="h-100 cashCard">
                        <Card.Header
                            className="header d-flex align-items-center justify-content-center"
                        >
                            <span className="currencyContainer d-flex align-items-center justify-content-center">
                                <img className="currency px-0 mx-0" alt="cash" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                            </span>
                        </Card.Header>
                        <Card.Body className="body">
                            <Row >
                                <Card.Title >
                                    <Container fluid className="px-0">
                                        <Row className="mx-0 w-100 mb-2">
                                            <Col className="ps-0">
                                                <h1 className="title my-0">
                                                    {t("Cash")}
                                                </h1>
                                            </Col>

                                            <button className="noStyle px-0 hideInfoButton d-flex align-items-center" onClick={() => { setPinned(false); setShow(false) }}>
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
                                                <span className="line"></span>
                                            </button>
                                        </Row>
                                    </Container>
                                    <Card.Text className="subTitle lighter mt-0 mb-2">
                                        <span className='d-flex justify-content-between'>
                                            <span>
                                                {t("Alias")}: <span className="bolder">{Fund.alias}</span>
                                            </span>
                                            <button className="noStyle px-0 hideInfoButton d-inline-flex align-items-center" onClick={() => {
                                                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Alias succesfully copied!" } });
                                                navigator.clipboard.writeText(Fund.alias)
                                            }}>
                                                <FontAwesomeIcon className="icon pin" icon={faClipboard} />
                                                <FontAwesomeIcon
                                                    className="icon placeholder"
                                                    icon={faEyeSlash}
                                                />
                                            </button>
                                        </span>
                                    </Card.Text>
                                </Card.Title>
                                <h1 className="title-gray mt-1">
                                    <Container fluid className="px-0">
                                        <Row className="w-100 mx-0 d-flex justify-content-between gx-0">
                                            <span className="pe-2 containerHideInfo">
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
                                            </span>
                                            <button onClick={() => setHide(prevState => !prevState)} className="noStyle ps-0 hideInfoButton d-flex align-items-center">
                                                <FontAwesomeIcon
                                                    className={`icon ${Hide ? "hidden" : "shown"}`}
                                                    icon={faEye}
                                                />
                                                <FontAwesomeIcon
                                                    className={`icon ${!Hide ? "hidden" : "shown"}`}
                                                    icon={faEyeSlash}
                                                />
                                                <FontAwesomeIcon
                                                    className="icon placeholder"
                                                    icon={faEyeSlash}
                                                />
                                            </button>
                                        </Row>
                                    </Container>
                                </h1>
                                <div className="subTitle lighter mt-0 mb-2">
                                    <span className='invisible'>{t("Balance (shares)")}:<span className="bolder"></span></span> <br />
                                    <span className='d-flex justify-content-between'>
                                        {
                                            pendingCash().calculated ?
                                                <>
                                                    <span>{t("Pending transactions")}:<span className={`bolder ${pendingCash().isPositive ? "text-green" : "text-red"}`}>
                                                        &nbsp;{pendingCash().isPositive ? "+" : "-"}${pendingCash().valueAbs}</span>
                                                    </span>
                                                    <OverlayTrigger show={show} trigger="click" placement="auto" overlay={
                                                        <Popover id="popover-overview-cash" style={{ maxWidth: "unset" }}>
                                                            <Popover.Header>{t("Overview of pending transactions")}</Popover.Header>
                                                            <Popover.Body className="pt-1 pb-2">
                                                                {t("Pending share sales")}:&nbsp;
                                                                <span className={`bolder ${pendingCash().overView.Transactions.isPositive ? "text-green" : "text-red"}`}>
                                                                    {pendingCash().overView.Transactions.isPositive ? "+" : "-"}${pendingCash().overView.Transactions.valueAbs}
                                                                </span><br />
                                                                {t("Pending withdrawals")}:&nbsp;
                                                                <span className={`bolder ${pendingCash().overView.Withdrawals.isPositive ? "text-green" : "text-red"}`}>
                                                                    {pendingCash().overView.Withdrawals.isPositive ? "+" : "-"}${pendingCash().overView.Withdrawals.valueAbs}
                                                                </span><br />
                                                                {t("Pending deposits")}:&nbsp;
                                                                <span className={`bolder ${pendingCash().overView.Deposits.isPositive ? "text-green" : "text-red"}`}>
                                                                    {pendingCash().overView.Deposits.isPositive ? "+" : "-"}${pendingCash().overView.Deposits.valueAbs}
                                                                </span><br />
                                                                {t("Pending transfers")}:&nbsp;
                                                                <span className={`bolder ${pendingCash().overView.Transfers.isPositive ? "text-green" : "text-red"}`}>
                                                                    {pendingCash().overView.Transfers.isPositive ? "+" : "-"}${pendingCash().overView.Transfers.valueAbs}
                                                                </span><br />
                                                                {t("Pending total")}:&nbsp;
                                                                <span className={`bolder ${pendingCash().isPositive ? "text-green" : "text-red"}`}>
                                                                    &nbsp;{pendingCash().isPositive ? "+" : "-"}${pendingCash().valueAbs}
                                                                </span>
                                                            </Popover.Body>
                                                        </Popover>
                                                    }>
                                                        <button onBlur={()=>setShow(false)} onClick={() => setShow(prevState => !prevState)}
                                                            className="noStyle px-0 hideInfoButton d-inline-flex align-items-center">
                                                            <FontAwesomeIcon className="icon pin" icon={faInfoCircle} />
                                                            <FontAwesomeIcon
                                                                className="icon placeholder"
                                                                icon={faEyeSlash}
                                                            />
                                                        </button>
                                                    </OverlayTrigger>
                                                </>
                                                :
                                                <>
                                                    {t("Pending transactions")}:<span className={`bolder text-green`}>&nbsp;<Spinner className="ms-2" animation="border" size="sm" /></span>
                                                </>
                                        }
                                    </span>
                                </div>
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
            }

        </>


    )
}
export default CashCard