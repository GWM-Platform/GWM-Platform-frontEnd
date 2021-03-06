import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DashBoardContext } from 'context/DashBoardContext';
import './index.css'
const FundInfo = ({ Fund }) => {
    const { token } = useContext(DashBoardContext)

    const [Hide, setHide] = useState(false)
    const [Performance, setPerformance] = useState({ value: 0, fetching: true })
    const balanceInCash = (Fund.freeShares * Fund.sharePrice)

    const { t } = useTranslation()
    useEffect(() => {
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
        getPerformance()
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
                        ${Fund.sharePrice}
                    </span>
                </h2>
            </div>
            <div>
                <h2 className="px-2 left">
                    {t("Balance (shares)")}:
                    <span style={{ fontWeight: "bolder" }}>
                        {Fund.freeShares}{" "}{" ("}{Fund.shares}{" "}{t("in total")}{")"}
                    </span>
                </h2>
            </div>
            <div className="d-flex justify-content-between align-items-end pe-2 pb-2 border-bottom-main">
                <Col className="d-flex justify-content-between pe-5" sm="auto">
                    <Col className="pe-2">
                        <div className="containerHideInfo px-2">
                            <span>{t("Balance ($)")}: $</span>
                            <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                {balanceInCash.toFixed(2).toString().replace(/./g, "*")}
                            </span>

                            <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                {balanceInCash.toFixed(2).toString()}
                            </span>

                            <span className={`info placeholder`}>
                                {balanceInCash.toFixed(2).toString()}
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
                </Col>
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
                                {Performance.value}%
                            </span>
                    }
                </Col>
            </div>
        </div>
    )
}
export default FundInfo

