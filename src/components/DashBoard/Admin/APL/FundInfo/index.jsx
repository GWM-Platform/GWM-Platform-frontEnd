import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
//eslint-disable-next-line
import { Col, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DashBoardContext } from 'context/DashBoardContext';
import './index.css'
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
        <div className="APL fundInfo bg-white info mt-2 ms-0 mb-2 px-0">
            <div className="d-flex justify-content-between align-items-end pe-2">
                <h1 className="m-0 title px-2">
                    {t(Fund.name)}
                </h1>
                <h2 className="m-0 left">
                    {t("Share price")}
                    <span className="ps-3" style={{ fontWeight: "bolder" }}>
                        <FormattedNumber value={Fund.sharePrice} prefix="U$D " fixedDecimals={2} />
                    </span>
                </h2>
            </div>
            <div>
                <h2 className="px-2 left">
                    {t("Balance (shares)")}:&nbsp;
                    <span style={{ fontWeight: "bolder" }}>
                        <FormattedNumber value={Fund.freeShares} fixedDecimals={2} />
                        &nbsp;
                        {"("}<FormattedNumber value={Fund.shares} fixedDecimals={2} />&nbsp;{t("in total")}{")"}
                    </span>
                </h2>
            </div>
            <div className="d-flex justify-content-between align-items-end pe-2 pb-2 border-bottom-main">
                <Col className="d-flex justify-content-between pe-5" sm="auto">
                    <Col className="pe-2">
                        <div className="containerHideInfo px-2">
                            <span>{t("Balance ($)")}:&nbsp;</span>
                            <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                            <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
                            <FormattedNumber className={`info placeholder`} value={balanceInCash} prefix="U$D " fixedDecimals={2} />
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

