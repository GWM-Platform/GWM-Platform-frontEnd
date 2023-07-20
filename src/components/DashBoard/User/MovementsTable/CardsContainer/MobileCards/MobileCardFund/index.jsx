import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row, Spinner } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerformance, selectPerformanceById } from 'Slices/DashboardUtilities/performancesSlice';
import { useEffect } from 'react';

const MobileCard = ({ Fund, Hide, setHide }) => {
    // eslint-disable-next-line

    const { PendingTransactions, ClientSelected } = useContext(DashBoardContext);
    const { t } = useTranslation();



    const balanceInCash = Fund.shares ? (Fund.shares * Fund.fund.sharePrice) : 0
    const pendingshares = PendingTransactions.value.filter((transaction) => transaction.fundId === Fund.fund.id && Math.sign(transaction.shares) === +1).map((transaction) => transaction.shares).reduce((a, b) => a + b, 0).toFixed(2)

    const checkImage = async (url) => {
        const res = await fetch(url);
        const buff = await res.blob();
        return buff.type.startsWith('image/')
    }

    const hasCustomImage = () => Fund.fund.imageUrl ? checkImage(Fund.fund.imageUrl) : false

    const dispatch = useDispatch()
    const performance = useSelector(state => selectPerformanceById(state, Fund.fund.id))

    useEffect(() => {
        dispatch(fetchPerformance({
            fund: Fund.fund.id,
            clientId: ClientSelected?.id
        }))
    }, [Fund, ClientSelected, dispatch])

    return (
        <Card className="movementsCardMobile">
            <Card.Header >
                <Container fluid className="px-3">
                    <Row className="d-flex justify-content-end align-items-center">
                        <Col className="p-0">

                            <Card.Title className="mb-0 py-1">
                                {t(Fund.fund.name)}
                                {

                                    <img alt=""
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src = process.env.PUBLIC_URL + '/images/FundsLogos/default.svg';
                                        }}
                                        src={hasCustomImage() ? Fund.fund.imageUrl : process.env.PUBLIC_URL + '/images/FundsLogos/default.svg'} />
                                }
                            </Card.Title>
                        </Col>
                    </Row>
                </Container>
            </Card.Header>
            <Card.Body className="pb-0 pt-1">
                <Container fluid className="p-0">
                    <Row className="m-1">
                        <Col xs="12" className="px-0">
                            <span className="left">
                                {t("Balance (shares)")}:&nbsp;
                                <FormattedNumber style={{ fontWeight: "bolder" }} value={Fund.shares ? Fund.shares : 0} fixedDecimals={2} />
                            </span>
                            <div className="d-flex justify-content-between px-0" sm="auto">
                                <Col className="pe-2">
                                    <div className="containerHideInfo px-0 description">
                                        <span>{t("Balance (U$S)")}</span>
                                        <span style={{ fontWeight: "bolder" }}>
                                            :&nbsp;
                                            <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                                            <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                                            <FormattedNumber className={`info placeholder`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                                        </span>

                                    </div>
                                </Col>
                                <Col sm="auto" className="hideInfoButton d-flex align-items-center">
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
                                </Col>
                            </div>
                            {
                                performance &&
                                <PerformanceComponent text={"Performance"} performance={performance?.performance} status={performance?.status} />
                            }
                            <span className="left">
                                {t("Pending transactions (shares)")}:&nbsp;
                                <FormattedNumber style={{ fontWeight: "bolder" }} value={pendingshares ? pendingshares : 0} fixedDecimals={2} />
                            </span>
                        </Col>
                        <TableLastMovements Fund={Fund} />
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}
export default MobileCard

const PerformanceComponent = ({ text, performance = 0, status = "loading" }) => {
    const { t } = useTranslation();

    return (
        /*TODO: show performance */
        <span className='text-start w-100 d-block invisible' style={{ fontWeight: "300" }}>
            {t(text)}:&nbsp;
            {
                status === "loading" ?
                    <Spinner size="sm" className="me-2" animation="border" variant="primary" />
                    :
                    <strong>
                        <FormattedNumber className={{
                            '1': 'text-green',
                            '-1': 'text-red'
                        }[Math.sign(performance)]}
                            value={performance} prefix="U$D " fixedDecimals={2} />
                    </strong>
            }
        </span>
    )
}