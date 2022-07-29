import React, { useState, useContext } from 'react'
import { useTranslation } from "react-i18next";
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainCardFund from './MainCard/MainCardFund';
import MainCardAccount from './MainCard/MainCardAccount';

import SecondaryCard from './SecondaryCard';
import MobileCardFund from './MobileCards/MobileCardFund';
import MobileCardAccount from './MobileCards/MobileCardAccount';

import { DashBoardContext } from 'context/DashBoardContext';
import { useLocation } from 'react-router-dom';

import './index.css'
import MainCardFixedDeposit from './MainCard/MainCardFixedDeposit';
import MobileCardFixedDeposits from './MobileCards/MobileCardFixedDeposits';

const CardsContainer = ({ isMobile, Funds, numberOfFunds, Accounts, FixedDeposits, FixedDepositsStats }) => {
    const { t } = useTranslation();

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const { PendingWithoutpossession } = useContext(DashBoardContext)

    const FundsWithPending = [...Funds, ...PendingWithoutpossession]

    const getFundIndexById = (id) => {
        let index = FundsWithPending.findIndex(Fund => Fund.fund.id.toString() === id)
        return index >= 0 ? { found: true, index: index } : { found: false, index: 0 }
    }

    const desiredId = useQuery().get("id")
    const desiredType = useQuery().get("type")
    const desiredFundId = useQuery().get("fundId")
    const validTypes = ["m", "t"]

    const [categorySelected, setCategorySelected] = useState(
        desiredType ?
            validTypes.includes(desiredType) ?
                desiredType === "t" ?
                    Funds.length > 0 ? 1 : 0
                    :
                    desiredType === "m" ? 0 : 0
                :
                Accounts.length > 0 ? 0 : Funds.length > 0 ? 1 : 0
            :
            Accounts.length > 0 ? 0 : Funds.length > 0 ? 1 : 0
    )

    const [selected, setSelected] = useState(desiredType === "t" && desiredFundId ? getFundIndexById(desiredFundId).found ? getFundIndexById(desiredFundId).index : 0 : 0)
    const [Hide, setHide] = useState(false)
    const [collapseSecondary, setCollapseSecondary] = useState(false)

    const performSearch = () => {
        if (desiredType) {
            if (validTypes.includes(desiredType)) {
                switch (desiredType) {
                    case "t":
                        if (desiredFundId) {
                            return getFundIndexById(desiredFundId).found
                        } else {
                            return false
                        }
                    case "m":
                        return true
                    default:
                        return false
                }
            } else {
                return false
            }
        } else {
            return false
        }

    }

    const [SearchById, setSearchById] = useState({
        value: performSearch() ? desiredId : "",
        search: performSearch()
    })

    const resetSearchById = () => {
        setSearchById((prevState) => ({ ...prevState, ...{ value: "", search: false } }))
    }

    const handleMovementSearchChange = (event) => {
        setSearchById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    return (
        <Row className="HistoryCardsContainer d-flex align-items-stretch flex-md-nowrap ">
            {isMobile ?
                Accounts.length >= 1 || FundsWithPending.length >= 1 ?
                    <Col md="12" className="ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0 growAnimation" >
                        {Accounts.map(
                            (account, key) =>
                                <MobileCardAccount key={"account-" + key} account={account} />
                        )}
                        {FundsWithPending.map(
                            (fund, key) =>
                                <MobileCardFund Hide={Hide} setHide={setHide} key={"fund-" + key} Fund={fund} />
                        )}
                        {!!(FixedDepositsStats?.fetched) && <MobileCardFixedDeposits Hide={Hide} setHide={setHide} FixedDepositsStats={FixedDepositsStats.content} FixedDeposits={FixedDeposits} />}
                    </Col>
                    :
                    <Col className="h-100">
                        <h1>{t("Your user doesn't have any account")}</h1>
                    </Col>
                :
                numberOfFunds > 1 ?
                    <>
                        <Col className="px-2 p-relative mainCardCol growAnimation" md="12"
                            lg={collapseSecondary ? "12" : "8"} xl={collapseSecondary ? "12" : "9"} >
                            {(() => {
                                switch (categorySelected) {
                                    case 0:
                                        return <MainCardAccount
                                            Fund={Accounts[selected]}
                                            Hide={Hide} setHide={setHide}

                                            SearchById={SearchById}
                                            setSearchById={setSearchById}
                                            resetSearchById={resetSearchById}
                                            handleMovementSearchChange={handleMovementSearchChange}
                                        />
                                    case 1:
                                        return <MainCardFund
                                            Fund={FundsWithPending[selected]}
                                            Hide={Hide} setHide={setHide}

                                            SearchById={SearchById}
                                            setSearchById={setSearchById}
                                            resetSearchById={resetSearchById}
                                            handleMovementSearchChange={handleMovementSearchChange}
                                        />
                                    case 2:
                                        return <MainCardFixedDeposit FixedDepositsStats={FixedDepositsStats.content} Hide={Hide} setHide={setHide} />
                                    default:
                                        return <h1>Default</h1>
                                }
                            })()}
                            <div className={`d-none d-sm-block collapser ${collapseSecondary ? "expanded" : "collapsed"}`}
                                onClick={() => { setCollapseSecondary(!collapseSecondary) }}>
                                <img className="chevron" src={`${process.env.PUBLIC_URL}/images/chevron/chevron-right.svg`} alt='collapse' />
                            </div>
                        </Col>
                        <Col sm="4" md="4" lg="4" xl="3"
                            className={
                                `secondaryCardContainer growAnimation
                                ${collapseSecondary ? "collapsed" : "expanded"} px-0 pe-2 pt-0 h-100`
                            }>

                            {
                                !!(Accounts.length > 0) &&
                                <div className="CategoryLabel">
                                    <h1 className="title">{t("Cash")}</h1>
                                </div>
                            }
                            {
                                Accounts.map(
                                    (Account, key) =>
                                        <SecondaryCard
                                            Hide={Hide} Fund={Account} parentKey={0} ownKey={key} key={key}
                                            categorySelected={categorySelected} setCategorySelected={setCategorySelected}
                                            selected={selected} setSelected={setSelected} resetSearchById={resetSearchById}

                                        />
                                )}
                            {
                                !!(Funds.length > 0) &&
                                <div className="CategoryLabel">
                                    <h1 className="title">{t("Funds")}</h1>
                                </div>
                            }
                            {
                                FundsWithPending.map(
                                    (Fund, key) => {
                                        ;
                                        return (
                                            <SecondaryCard
                                                Hide={Hide} Fund={Fund} parentKey={1} ownKey={key} key={key}
                                                categorySelected={categorySelected} setCategorySelected={setCategorySelected}
                                                selected={selected} setSelected={setSelected} resetSearchById={resetSearchById}
                                            />
                                        )
                                    }
                                )
                            }

                            {
                                !!(FixedDepositsStats?.content?.hasDeposits > 0) &&
                                <>
                                    <div className="CategoryLabel">
                                        <h1 className="title">{t("Fixed deposits")}</h1>
                                    </div>
                                    <SecondaryCard
                                        Hide={Hide} Fund={FixedDepositsStats.content} parentKey={2}
                                        categorySelected={categorySelected} setCategorySelected={setCategorySelected}
                                        selected={selected} setSelected={setSelected} resetSearchById={resetSearchById}
                                    />
                                </>
                            }
                        </Col>
                    </>
                    :
                    <Col className="px-2 pb-2 growAnimation" xs="12" xl="12" >
                        {Accounts.length === 1 ?
                            <MainCardAccount
                                Fund={Accounts[0]}
                                Hide={Hide} setHide={setHide}

                                SearchById={SearchById}
                                setSearchById={setSearchById}
                                resetSearchById={resetSearchById}
                                handleMovementSearchChange={handleMovementSearchChange}
                            />
                            :
                            <MainCardFund
                                Fund={Funds[0]}
                                Hide={Hide} setHide={setHide}

                                SearchById={SearchById}
                                setSearchById={setSearchById}
                                resetSearchById={resetSearchById}
                                handleMovementSearchChange={handleMovementSearchChange}
                            />
                        }
                    </Col>
            }
        </Row>
    )
}
export default CardsContainer
