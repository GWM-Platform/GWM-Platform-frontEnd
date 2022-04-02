import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DashBoardContext } from 'context/DashBoardContext';

const FundInfo = ({ Fund }) => {
    const { token } = useContext(DashBoardContext)

    const [Hide, setHide] = useState(false)
    const [Performance, setPerformance] = useState(0)
    const balanceInCash = (Fund.freeShares * Fund.sharePrice)
    
    const { t } = useTranslation()

    useEffect(() => {
        const getPerformance = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds/${Fund.id}/performance?` + new URLSearchParams(
                {
                    client: "all"
                });

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
                setPerformance(data.toFixed(2))
            } else {
                switch (response.status) {
                    default:
                        console.error(response.status)
                }
            }
        }

        //getPerformance()
    }, [Fund, token])

    return (
        <div className="bg-white info mt-2 ms-0 mb-2 px-0">
            <div className="d-flex justify-content-between align-items-end pe-2">
                <h1 className="m-0 title px-2">
                    {t(Fund.name)}
                </h1>
                <h2 className="m-0 left">
                    {t("FeePart price (Now)")}
                    <span className="ps-3" style={{ fontWeight: "bolder" }}>
                        ${Fund.sharePrice}
                    </span>
                </h2>
            </div>
            <div>
                <h2 className="px-2 left">
                    {Fund.freeShares}{" "}{t("feeParts in possession")}{" ("}{Fund.shares}{" "}{t("in total")}{")"}
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
                    <span
                        className={{
                            '1': 'text-green',
                            '-1': 'text-red'
                        }[Math.sign(Performance)]}>
                        {Performance}%
                    </span>
                </Col>
            </div>
        </div>
    )
}
export default FundInfo

