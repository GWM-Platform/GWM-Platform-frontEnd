import React, { useState, useContext, useEffect } from 'react'
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
import { useHorizontalMobileAction } from 'components/DashBoard';
import { formatValue } from '@osdiab/react-currency-input-field';
import Decimal from 'decimal.js';
import { selectAllHistoricFunds } from 'Slices/DashboardUtilities/historicFundsSlice';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const CardsContainer = ({ isMobile, Funds, numberOfFunds, Accounts, FixedDepositsStats }) => {
    const { t } = useTranslation();

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const { PendingWithoutpossession, hasPermission, AccountSelected, ClientSelected } = useContext(DashBoardContext)
    const historicFunds = useSelector(selectAllHistoricFunds)

    const FundsWithPending = useMemo(() => {
        const holdings = [...Funds, ...PendingWithoutpossession]
        return [
            ...holdings,
            ...historicFunds.filter(historicFund =>
                !holdings.some(holding => holding.fundId === historicFund.id)
            ).map(fund => (
                {
                    id: fund.id,
                    clientId: ClientSelected.id,
                    fundId: fund.id,
                    shares: 0,
                    createdAt: "2022-05-20T13:30:28.116Z",
                    updatedAt: "2024-10-21T12:53:43.000Z",
                    fund,
                    historic: true
                }
            ))
        ]
    }, [ClientSelected.id, Funds, PendingWithoutpossession, historicFunds])

    const getFundIndexById = (id) => {
        let index = FundsWithPending.findIndex(Fund => Fund.fund.id.toString() === id)
        return index >= 0 ? { found: true, index: index } : { found: false, index: 0 }
    }

    const desiredId = useQuery().get("id")
    const desiredType = useQuery().get("type")
    const desiredFundId = useQuery().get("fundId")
    const validTypes = ["m", "t", "t-d", "transfers", "share-transfers"]

    const [categorySelected, setCategorySelected] = useState(
        desiredType ?
            validTypes.includes(desiredType) ?
                desiredType === "share-transfers" ?
                    Funds.length > 0 ? 1 : 0
                    :
                    desiredType === "t" ?
                        Funds.length > 0 ? 1 : 0
                        :
                        desiredType === "t-d" ?
                            2
                            :
                            desiredType === "m" || desiredType === "transfers" ? 0 : 0
                :
                Accounts.length > 0 && hasPermission('VIEW_ACCOUNT') ? 0 : Funds.length > 0 ? 1 : 0
            :
            Accounts.length > 0 && hasPermission('VIEW_ACCOUNT') ? 0 : Funds.length > 0 ? 1 : 0
    )

    const [selected, setSelected] = useState(desiredType === "t-d" ? undefined : desiredType === "t" && desiredFundId ? getFundIndexById(desiredFundId).found ? getFundIndexById(desiredFundId).index : 0 : 0)
    const [Hide, setHide] = useState(false)
    const [collapseSecondary, setCollapseSecondary] = useState(false)

    const performSearch = () => {
        if (desiredType && desiredId) {
            if (validTypes.includes(desiredType)) {
                switch (desiredType) {
                    case "t":
                        if (desiredFundId) {
                            return getFundIndexById(desiredFundId).found
                        } else {
                            return false
                        }
                    case "share-transfers":
                        if (desiredFundId) {
                            return getFundIndexById(desiredFundId).found
                        } else {
                            return false
                        }
                    case "m":
                        return true
                    case "transfers":
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

    useHorizontalMobileAction({
        matched: () => {
            setCollapseSecondary(true)
        },
        notMatched: () => {
            setCollapseSecondary(false)
        }
    })

    const sections = [
        ...!!(Accounts.length > 0 && hasPermission('VIEW_ACCOUNT')) ? [{
            title: `${t("Cash")
                } ${formatValue({
                    value: Decimal(Accounts[0]?.balance || 0).abs().toFixed(2),
                    groupSeparator: '.',
                    decimalSeparator: ',',
                    prefix: "U$D "
                })}`,
            active: categorySelected === 0,
            onSelect: () => {
                setCategorySelected(0)
                setSelected(0)
                resetSearchById()
            }
        }] : [],
        ...!!(FundsWithPending.length > 0) ? [{
            title: t("Funds"),
            children: FundsWithPending.map(
                (Fund, key) => ({
                    title: `${Fund?.fund?.name} ${formatValue({
                        value: Decimal(Fund.shares ? new Decimal(Fund?.shares || 0).times(Fund?.fund?.sharePrice || 0).toFixed(2).toString() : 0).abs().toFixed(2),
                        groupSeparator: '.',
                        decimalSeparator: ',',
                        prefix: "U$D "
                    })
                        } `,
                    active: categorySelected === 1 && selected === key,
                    onSelect: () => {
                        setCategorySelected(1)
                        setSelected(key)
                        resetSearchById()
                    }
                })
            ),
        }] : [],
        ...!!(FixedDepositsStats?.content?.hasDeposits > 0) ? [{
            title: t(`${t("Time deposits")} ${formatValue({
                value: (FixedDepositsStats.content.balance || 0) + "",
                groupSeparator: '.',
                decimalSeparator: ',',
                prefix: "U$D "
            })}`),
            active: categorySelected === 2,
            onSelect: () => {
                setCategorySelected(2)
                setSelected(0)
                resetSearchById()
            }
        }] : [],
    ]
    const [selectedFixedDepositId, setSelectedFixedDepositId] = useState(null)
    const linkToOtherHistory = (id, type = "FIXED_DEPOSIT") => {
        if (type === "FIXED_DEPOSIT") {
            setSelectedFixedDepositId(id)
            setCategorySelected(2)
        } else if (type === "FUND") {
            const index = FundsWithPending.findIndex(fund => fund.fund.id === id)
            if (index >= 0) {
                setCategorySelected(1)
                setSelected(index)
            }
        }

    }

    useEffect(() => {
        if (categorySelected !== 2) {
            setSelectedFixedDepositId(null)
        }
    }, [categorySelected])

    return (
        <Row className="HistoryCardsContainer d-flex align-items-stretch flex-md-nowrap h-100">
            {
                isMobile && <style>{`.tabContent{ overflow-y: hidden!important } .mobile-container{ overflow: overlay; height: 100%;  scroll-snap-type: y mandatory; } .movementsCardMobile{ scroll-snap-align: center }`}</style>
            }
            {isMobile ?
                Accounts.length >= 1 || FundsWithPending.length >= 1 ?
                    <Col md="12" className="ps-2 ps-sm-2 ps-md-2 ps-md-0 ps-lg-0 pe-2 pt-0 growAnimation mobile-container" >
                        {hasPermission('VIEW_ACCOUNT') &&
                            <>
                                {
                                    Accounts.map(
                                        (account, key) =>
                                            <MobileCardAccount key={"account-" + key} account={account} />
                                    )
                                }
                            </>
                        }
                        {FundsWithPending.map(
                            (fund, key) =>
                                <MobileCardFund Hide={Hide} setHide={setHide} key={"fund-" + key} Fund={fund} />
                        )}

                        {!!(FixedDepositsStats?.fetched && hasPermission("FIXED_DEPOSIT_VIEW")) && <MobileCardFixedDeposits Hide={Hide} setHide={setHide} FixedDepositsStats={FixedDepositsStats.content} />}
                    </Col>
                    :
                    <Col className="h-100">
                        <h1>{t("Your user doesn't have any account")}</h1>
                    </Col>
                :
                numberOfFunds > 1 ?
                    <>
                        <Col className="px-2 p-relative mainCardCol growAnimation  overflow-auto"
                            xs={collapseSecondary ? "12" : "8"} lg={collapseSecondary ? "12" : "8"} xl={collapseSecondary ? "12" : "9"} >
                            {(() => {
                                switch (categorySelected) {
                                    case 0:
                                        return (hasPermission('VIEW_ACCOUNT') &&
                                            <MainCardAccount
                                                linkToOtherHistory={linkToOtherHistory}
                                                sections={sections}
                                                Fund={Accounts[selected]}
                                                Hide={Hide} setHide={setHide}

                                                SearchById={SearchById}
                                                setSearchById={setSearchById}
                                                resetSearchById={resetSearchById}
                                                handleMovementSearchChange={handleMovementSearchChange}
                                            />)
                                    case 1:
                                        return <MainCardFund
                                            Fund={FundsWithPending[selected]}
                                            Hide={Hide} setHide={setHide}
                                            sections={sections}

                                            SearchById={SearchById}
                                            setSearchById={setSearchById}
                                            resetSearchById={resetSearchById}
                                            handleMovementSearchChange={handleMovementSearchChange}
                                        />
                                    case 2:
                                        return <MainCardFixedDeposit selectedFixedDepositId={selectedFixedDepositId} sections={sections} FixedDepositsStats={FixedDepositsStats.content} Hide={Hide} setHide={setHide} />
                                    default:
                                        return <h1>{t("Not found")}</h1>
                                }
                            })()}
                            <div className={`d-none d-sm-block collapser ${collapseSecondary ? "expanded" : "collapsed"}`}
                                onClick={() => { setCollapseSecondary(!collapseSecondary) }}>
                                <img className="chevron" src={`${process.env.PUBLIC_URL}/images/chevron/chevron-right.svg`} alt='collapse' />
                            </div>
                        </Col>
                        <Col sm="4" md="4" lg="4" xl="3"
                            className={`secondaryCardContainer growAnimation overflow-auto ${collapseSecondary ? "collapsed" : "expanded"} px-0 pe-2 pt-0 h-100`}>
                            {
                                !!(Accounts.length > 0 && hasPermission('VIEW_ACCOUNT')) &&
                                <div className="CategoryLabel">
                                    <h1 className="title">{t("Cash")}</h1>
                                </div>
                            }
                            {
                                hasPermission('VIEW_ACCOUNT') &&
                                <>
                                    {
                                        Accounts.map(
                                            (Account, key) =>
                                                <SecondaryCard
                                                    Hide={Hide} Fund={Account} parentKey={0} ownKey={key} key={key}
                                                    categorySelected={categorySelected} setCategorySelected={setCategorySelected}
                                                    selected={selected} setSelected={setSelected} resetSearchById={resetSearchById}

                                                />
                                        )
                                    }
                                </>
                            }
                            {
                                !!(FundsWithPending.length > 0) &&
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
                                        <h1 className="title">{t("Time deposits")}</h1>
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
                                linkToOtherHistory={linkToOtherHistory}
                                Fund={AccountSelected}
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
