import React, { useContext } from 'react'
import { Container, Row, Col, Card, Button, Spinner, OverlayTrigger, Popover } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlash, faEyeSlash, faEye, faThumbtack, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faClipboard } from '@fortawesome/free-regular-svg-icons'
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useHistory } from 'react-router-dom';

const CashCardPinned = ({ Hide, setHide, Fund, Pinned, setPinned, show, setShow, pendingCash }) => {
    Decimal.set({ precision: 100 })

    const { t } = useTranslation();

    const { DashboardToastDispatch, isMobile, hasPermission } = useContext(DashBoardContext)
    let history = useHistory();


    const toWithdraw = (type) => {
        history.push(`/DashBoard/withdraw`);
    }
    return (
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
                        <Card.Title className="mb-2 mt-0" >
                            <Container fluid className="px-0">
                                <Row className="mx-0 w-100">
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
                        <div className="subTitle lighter mt-0 mb-0">
                            <span className='invisible'>{t("Balance (shares)")}:<span className="bolder"></span></span> <br />
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
                                                <Popover id="popover-overview-cash-pinned" style={{ maxWidth: "unset" }}>
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
                                                        {t("Pending transfers")}:&nbsp;
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
                                        <div className='d-flex align-items-center'>
                                            {t("Pending transactions")}:<span className={`bolder text-green`}>&nbsp;<Spinner className="ms-2" animation="border" size="sm" /></span>
                                        </div>
                                }
                            </span>
                        </div>
                    </Row>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="12" className="d-flex justify-content-center p-0 m-0">
                            <Button disabled={!hasPermission('WITHDRAW')} onClick={() => toWithdraw()} className="button d-flex align-items-center justify-content-center">
                                <span className="label">{t("Withdraw")}</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>
    )
}
export default CashCardPinned