import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useRef } from 'react'
import './index.scss'
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Decimal from 'decimal.js';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';
import { customFetch } from 'utils/customFetch';

//Parent key 0-> Fund;Parent key 1->Cash
const SecondaryCard = ({ Fund, setCategorySelected, setSelected, parentKey, ownKey, selected, Hide, categorySelected, resetSearchById, historic }) => {
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
        const res = await customFetch(url);
        const buff = await res.blob();
        return buff.type.startsWith('image/')
    }

    const hasCustomImage = () => Fund.fund.imageUrl ? checkImage(Fund.fund.imageUrl) : false

    return (
        <Container fluid className="pt-0 pb-2 px-1 growAnimation" ref={ref} >
            <Row className={`secondaryCard ${parentKey === categorySelected && selected === ownKey ? "selected" : null} ${historic ? "historic" : ""} flex-nowrap mx-0 px-0`} onClick={select}>
                <Col lg="auto" className={`d-none d-sm-none d-md-none d-lg-flex currencyCol d-flex align-items-center ${historic ? "historic" : ""}`}>
                    <div className="currencyContainer d-flex align-items-center justify-content-center" >
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
                                <FormattedNumber value={balanceInCash().toString()} prefix="U$D " fixedDecimals={2} />
                            </div>
                        </h2>
                        <span className={parentKey === 0 ? "invisible" : ""}>
                            <PerformanceComponent withBreakLine className='performance-component' withoutSelector text={"Accumulated performance"} fundId={parentKey === 1 ? Fund?.fundId : ""} fixedDepositId={parentKey === 2 ? "1" : ""} />
                        </span>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
export default SecondaryCard
