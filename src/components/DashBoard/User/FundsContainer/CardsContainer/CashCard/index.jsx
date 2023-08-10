import React, { useContext } from 'react'
import { Container, Row, Col, Card, Button, Spinner, OverlayTrigger, Popover } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faThumbtack, faInfoCircle, faSlash } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faClipboard } from '@fortawesome/free-regular-svg-icons'
import { Link, useHistory } from 'react-router-dom';
import './index.scss'
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useState } from 'react';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';

const CashCard = ({ Hide, setHide, Fund, cardsAmount, inScreenFunds, pendingCash, setShow, show }) => {
    const { DashboardToastDispatch, isMobile, hasPermission } = useContext(DashBoardContext)

    Decimal.set({ precision: 100 })

    const { t } = useTranslation();

    let history = useHistory();


    const [Pinned, setPinned] = useState(false)

    const toTransfer = () => {
        history.push(`/DashBoard/transfer`);
    }

    const toWithdraw = (type) => {
        history.push(`/DashBoard/withdraw`);
    }


    return (
        <Col sm="6" md="6" lg="4" className={`fund-col  growAnimation ${Pinned && !isMobile ? "pinned" : ""}`}>
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
                        <Card.Title className="my-0" >
                            <Container fluid className="px-0">
                                <Row className="mx-0 w-100 my-0">
                                    <Col className="ps-0">
                                        <h1 className="title my-0">
                                            {t("Cash")}
                                        </h1>
                                    </Col>
                                    {
                                        !!(cardsAmount > inScreenFunds && !isMobile) &&
                                        <button className="noStyle px-0 hideInfoButton d-flex align-items-center" onClick={() => { setPinned(prevState => !prevState); setShow(false) }}                                            >
                                            <div className={Pinned ? "" : "opacity-0 d-none"}>
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
                                            </div>
                                            <div className={Pinned ? "opacity-0 d-none" : ""}>
                                                <FontAwesomeIcon
                                                    className="icon pin"
                                                    icon={faThumbtack}
                                                />
                                                <FontAwesomeIcon
                                                    className="icon placeholder"
                                                    icon={faEyeSlash}
                                                />
                                            </div>

                                            <span className="line"></span>
                                        </button>
                                    }
                                </Row>
                            </Container>
                            <Card.Text className="subTitle lighter mt-0 mb-1">
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
                        <h1 className="title-gray mt-0">
                            <Container fluid className="px-0">
                                <Row className="w-100 mx-0 d-flex justify-content-between gx-0">
                                    <span className="pe-2 containerHideInfo">
                                        <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={parseFloat(Fund.balance).toString()} prefix="U$D " fixedDecimals={2} />
                                        <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={parseFloat(Fund.balance).toString()} prefix="U$D " fixedDecimals={2} />
                                        <FormattedNumber className={`info placeholder`} value={parseFloat(Fund.balance).toString()} prefix="U$D " fixedDecimals={2} />
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
                        {
                            performance &&
                            <PerformanceComponent text={"Total performance"} />
                        }
                        <div className="subTitle lighter mt-0 mb-0">
                            <span className='invisible'>{t("Balance (shares)")}:<span className="bolder"></span></span> <br />
                        </div>
                        <div className="subTitle lighter mt-0 mb-0">
                            <span className='d-flex justify-content-between'>
                                {
                                    pendingCash().calculated ?
                                        <div className='d-flex align-items-center'>
                                            <span>{t("Pending transactions")}:&nbsp;
                                                <span className={`bolder ${pendingCash().isPositive ? "text-green" : "text-red"}`}>
                                                    {pendingCash().isPositive ? "+" : "-"}
                                                    <FormattedNumber value={pendingCash().valueAbs} prefix="U$D " fixedDecimals={2} />
                                                </span>
                                            </span>

                                            <OverlayTrigger show={show} trigger="click" placement="auto-start" overlay={
                                                <Popover id="popover-overview-cash" >
                                                    <Popover.Header>{t("Overview of pending transactions")}</Popover.Header>
                                                    <Popover.Body className="pt-1 pb-2">
                                                        {t("Pending share sales")}:&nbsp;
                                                        <span className={`bolder ${pendingCash().overView.Transactions.isPositive ? "text-green" : "text-red"}`}>
                                                            {pendingCash().overView.Transactions.isPositive ? "+" : "-"}
                                                            <FormattedNumber value={pendingCash().overView.Transactions.valueAbs} prefix="U$D " fixedDecimals={2} />
                                                        </span><br />
                                                        {t("Pending withdrawals")}:&nbsp;
                                                        <span className={`bolder ${pendingCash().overView.Withdrawals.isPositive ? "text-green" : "text-red"}`}>
                                                            {pendingCash().overView.Withdrawals.isPositive ? "+" : "-"}
                                                            <FormattedNumber value={pendingCash().overView.Withdrawals.valueAbs} prefix="U$D " fixedDecimals={2} />
                                                        </span><br />
                                                        {t("Pending deposits")}:&nbsp;
                                                        <span className={`bolder ${pendingCash().overView.Deposits.isPositive ? "text-green" : "text-red"}`}>
                                                            {pendingCash().overView.Deposits.isPositive ? "+" : "-"}
                                                            <FormattedNumber value={pendingCash().overView.Deposits.valueAbs} prefix="U$D " fixedDecimals={2} />
                                                        </span><br />
                                                        <Link to="history?SelectedTab=Transfers">{t("Pending transfers")}</Link>:&nbsp;
                                                        <span className={`bolder ${pendingCash().overView.Transfers.isPositive ? "text-green" : "text-red"}`}>
                                                            {pendingCash().overView.Transfers.isPositive ? "+" : "-"}
                                                            <FormattedNumber value={pendingCash().overView.Transfers.valueAbs} prefix="U$D " fixedDecimals={2} />
                                                        </span><br />
                                                        {t("Pending total")}:&nbsp;
                                                        <span className={`bolder ${pendingCash().isPositive ? "text-green" : "text-red"}`}>
                                                            {pendingCash().isPositive ? "+" : "-"}
                                                            <FormattedNumber value={pendingCash().valueAbs} prefix="U$D " fixedDecimals={2} />
                                                        </span>
                                                    </Popover.Body>
                                                </Popover>
                                            }>
                                                <button onBlur={() => setShow(false)} onClick={() => setShow(prevState => !prevState)}
                                                    className="noStyle px-0 hideInfoButton d-inline-flex align-items-center">
                                                    <FontAwesomeIcon className="icon pin" icon={faInfoCircle} />
                                                    <FontAwesomeIcon
                                                        className="icon placeholder"
                                                        icon={faEyeSlash}
                                                    />
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                        :
                                        <div>
                                            {t("Pending transactions")}:<span className={`bolder`}>&nbsp;<Spinner className="ms-2" animation="border" size="sm" /></span>
                                        </div>
                                }
                            </span>
                        </div>
                    </Row>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button
                                disabled={!hasPermission('TRANSFER_GENERATE')}
                                onClick={() => toTransfer()} className="me-1 button left">
                                <span className="label">{t("to Transfer")}</span>
                            </Button>
                        </Col>
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button
                                disabled={!hasPermission('WITHDRAW')}
                                onClick={() => toWithdraw()} className="ms-1 button right">
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