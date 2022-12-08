import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useRef } from 'react'
import './index.css'
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Decimal from 'decimal.js';
//Parent key 0-> Fund;Parent key 1->Cash
const SecondaryCard = ({ Fund, setCategorySelected, setSelected, parentKey, ownKey, selected, Hide, categorySelected, resetSearchById }) => {
    const select = () => {
        setCategorySelected(parentKey)
        setSelected(ownKey)
        resetSearchById()
    }

    const ref = useRef(null)

    const { t } = useTranslation();

    const balanceInCash = () => {
        switch (parentKey) {
            case 0:
                return Fund.balance
            case 1:
                return Fund.shares ? new Decimal(Fund?.shares || 0).times(Fund?.fund?.sharePrice || 0).toFixed(2).toString() : 0
            case 2:
                return Fund.balance
            default:
                return 0
        }
    }

    const checkImage = async (url) => {
        const res = await fetch(url);
        const buff = await res.blob();
        return buff.type.startsWith('image/')
    }

    const hasCustomImage = () => Fund.fund.imageUrl ? checkImage(Fund.fund.imageUrl) : false

    return (
        <Container fluid className="pt-0 pb-2 px-1 growAnimation" ref={ref} >
            <Row className={`secondaryCard ${parentKey === categorySelected && selected === ownKey ? "selected" : null} mx-0 px-0`} onClick={select}>
                <Col lg="auto" className="d-none d-sm-none d-md-none d-lg-flex currencyCol d-flex align-items-center">
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        {(() => {
                            switch (parentKey) {
                                case 0:
                                    return <img className="currency px-0 mx-0" alt="cash" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                                case 1:
                                    return <img className="currency px-0 mx-0" alt=""
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src = process.env.PUBLIC_URL + '/images/FundsLogos/default.svg';
                                        }}
                                        src={hasCustomImage() ? Fund.fund.imageUrl : process.env.PUBLIC_URL + '/images/FundsLogos/default.svg'} />
                                case 2:
                                    return <FontAwesomeIcon color='white' icon={faPiggyBank} />
                                default:
                                    return <img className="currency px-0 mx-0" alt="cash" src={process.env.PUBLIC_URL + '/images/FundsLogos/cash.svg'} />
                            }
                        })()}
                    </div>
                </Col>
                <Col className="secondary d-flex align-items-start flex-column" >
                    <div className="mb-auto mt-2">
                        <h1 className="description mt-0 pt-0">
                            {
                                t(
                                    {
                                        0: "Cash",
                                        1: Fund?.fund?.name,
                                        2: "Time deposits"
                                    }[parentKey]
                                )
                            }
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h2 className="funds">
                            <div className="containerHideInfo">
                                <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash().toString()} prefix="$" fixedDecimals={2} />
                                <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash().toString()} prefix="$" fixedDecimals={2} />
                                <FormattedNumber className={`info placeholder`} value={balanceInCash().toString()} prefix="$" fixedDecimals={2} />
                            </div>
                        </h2>
                        <span className="funds-description">{t("Balance")}</span>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
export default SecondaryCard
