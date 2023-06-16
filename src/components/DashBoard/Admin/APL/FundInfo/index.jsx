import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
//eslint-disable-next-line
import { Col, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DashBoardContext } from 'context/DashBoardContext';

import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
const FundInfo = ({ Fund }) => {
    const { token } = useContext(DashBoardContext)

    const [Hide, setHide] = useState(false)
    //eslint-disable-next-line
    const [Performance, setPerformance] = useState({ value: 0, fetching: true })
    const balanceInCash = (Fund.freeShares * Fund.sharePrice)

    const { t } = useTranslation()
    useEffect(() => {
        //eslint-disable-next-line
        const getPerformance = async () => {
            setPerformance(prevState => ({ ...prevState, ...{ fetching: true, value: 0 } }))
            var url = `${process.env.REACT_APP_APIURL}/funds/${Fund.id}/performance`

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
                setPerformance(prevState => ({ ...prevState, ...{ fetching: false, value: data.toFixed(2) } }))
            } else {
                switch (response.status) {
                    default:
                        setPerformance(prevState => ({ ...prevState, ...{ fetching: false, value: 0 } }))
                        console.error(response.status)
                }
            }
        }
        /*TODO - Show again when the backend is fixed*/
        //getPerformance()
    }, [Fund, token])

    return (
        <div className="fundInfo bg-white info ms-0">
            <div className="d-flex justify-content-between align-items-end">
                <h1 className="m-0 title pe-2">
                    {t("Fund")} "{t(Fund.name)}"
                </h1>
                <h2 className="left">
                    {t("Share price")}
                    <br />
                    <span style={{ fontWeight: "bolder" }}>
                        <FormattedNumber value={Fund.sharePrice} prefix="U$D " fixedDecimals={2} />
                    </span>
                </h2>
            </div>
            <div>
                <h2 className="mt-2 pe-2 topic">
                    {t("Balance (shares)")}
                    <br />
                    <span style={{ fontWeight: "bolder" }}>
                        <FormattedNumber value={Fund.freeShares} fixedDecimals={2} />
                        &nbsp;
                        {"("}<FormattedNumber value={Fund.shares} fixedDecimals={2} />&nbsp;{t("in total")}{")"}
                    </span>
                </h2>
            </div>
            <div className="d-flex justify-content-between align-items-end pe-2 border-bottom-main">
                <Col className="d-flex justify-content-between pe-5" sm="auto">
                    <Col className="pe-2">
                        <h2 className="mt-2 pe-2 topic">
                            {t("Balance")}
                        </h2>
                        <div className="containerHideInfo d-inline">
                            <FormattedNumber prefix="U$S " hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash} fixedDecimals={2} />
                            <FormattedNumber prefix="U$S " className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash} fixedDecimals={2} />
                            <FormattedNumber prefix="U$S " className={`info placeholder`} value={balanceInCash} fixedDecimals={2} />
                        </div>
                        <div className="hideInfoButton d-inline-flex align-items-center mt-1">
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
                    </Col>
                </Col>
                {/*
                <Col sm="auto" >
                    {t("Performance")}{": "}
                    {
                        Performance.fetching ?
                            <Spinner animation="border" size="sm" />
                            :
                            <span
                                className={{
                                    '1': 'text-green',
                                    '-1': 'text-red'
                                }[Math.sign(Performance.value)]}>
                                <FormattedNumber value={Performance.value} suffix="%" fixedDecimals={2} />
                            </span>
                    }
                </Col>
                */}
            </div>
        </div>
    )
}
export default FundInfo

