import React, { useEffect, createRef, useState, useContext } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundCard from './FundCard';
import CashCard from './CashCard';
import { DashBoardContext } from 'context/DashBoardContext';
import Indicators from './Indicators'
import './index.css'
import FixedDepositCard from './FixedDepositCard';
import CashCardPinned from './CashCardPinned';
import Decimal from 'decimal.js';

const CardsContainer = ({ setItemSelected, Funds, Accounts, PendingTransactions, PendingWithoutpossession, FixedDeposits }) => {
    const { width, token, ClientSelected,hasPermission } = useContext(DashBoardContext)

    const [CardWidth, setCardWidth] = useState(false)
    const [Offset, setOffset] = useState(0)
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const [Hide, setHide] = useState(false)
    const [Pinned, setPinned] = useState(false)

    //Only shows approved or pending fixedDeposits
    const shownFixedDeposits = () => {
        return FixedDeposits?.deposits.filter(FixedDeposits => (FixedDeposits.stateId === 2 || FixedDeposits.stateId === 1) && !FixedDeposits.closed) || []
    }

    //For scrolling
    const FundsContainer = createRef()

    const isNull = () => !FundsContainer.current

    //Scrolling Function
    const setScrollPositionByOffset = (offset) => {
        if (!isNull()) {
            let widthScroll =
                isNull() ?
                    "" :
                    CardWidth ?
                        FundsContainer.current.clientWidth / CardWidth :
                        FundsContainer.current.clientWidth / 3
            let scroll = widthScroll * offset
            FundsContainer.current.scrollTo({
                top: 0,
                left: scroll,
                behavior: 'smooth'
            })
            let maxOffset = Funds.length + PendingWithoutpossession.length + shownFixedDeposits().length + 1 - CardWidth
            let toSetOffset = offset > maxOffset ? maxOffset : offset
            setShowRightChevron(toSetOffset !== maxOffset)
            setShowLeftChevron(toSetOffset !== 0)
            setOffset(toSetOffset)
        }
    }

    useEffect(() => {
        return () => {
        }
    }, [Funds, PendingWithoutpossession])

    useEffect(() => {
        if (width < 578) {
            setCardWidth(1)
        } else if (width < 992) {
            setCardWidth(2)
        } else {
            setCardWidth(3)
        }
    }, [width])

    const totalCards = () => Funds.length + PendingWithoutpossession.length + shownFixedDeposits().length + (hasPermission('VIEW_ACCOUNT') ? 1 : 0)//+1 cta cte
    hasPermission('VIEW_ACCOUNT')

    Decimal.set({ precision: 100 })

    const [PendingMovements, setPendingMovements] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )

    const [PendingTransfers, setPendingTransfers] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )

    const [show, setShow] = useState(false);

    const pendingCash = () => {
        if (PendingMovements.fetched && PendingTransactions.fetched && PendingTransfers.fetched && !(PendingMovements.fetching || PendingTransactions.fetching || PendingTransfers.fetching)) {

            //Solo las ventas, las compras se ven reflejadas en el pendiente de cada fondo como cuotapartes
            const PendingSales = PendingTransactions.value.filter((transaction) => Math.sign(transaction.shares) === -1)
            const pendingCashFromTransactions = PendingSales.map(
                (transaction) => new Decimal(transaction.shares).abs().times(transaction.sharePrice)
            ).reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            //Retiros unicamente, compra y venta se ven reflejados en otro lado
            const PendingWithdrawals = PendingMovements.value.filter((movement) => movement.motive === "WITHDRAWAL")
            const pendingCashFromWithdrawals = PendingWithdrawals.map((movement) => new Decimal(movement.amount))
                .reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            //Depositos unicamente, compra y venta se ven reflejados en otro lado
            const PendingDeposits = PendingMovements.value.filter((movement) => movement.motive === "DEPOSIT")
            const pendingCashFromDeposits = PendingDeposits.map((movement) => new Decimal(movement.amount))
                .reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            //Transferencias
            const PendingSentAndReceivedTransfers = PendingTransfers.value
            const clientId = ClientSelected?.id
            const pendingCashFromTransfers = PendingSentAndReceivedTransfers.map((transfer) => {
                const amount = new Decimal(transfer.amount)
                return (
                    transfer.senderId === clientId && amount.isPositive() ? amount.negated() : amount
                )
            }).reduce((previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0)

            const total = (new Decimal(pendingCashFromTransactions).add(pendingCashFromWithdrawals).add(pendingCashFromDeposits).add(pendingCashFromTransfers))
            return {
                valueAbs: total.abs().toFixed(2).toString(),
                isPositive: total.isPositive(),
                calculated: true,
                overView: {
                    Transactions: {
                        valueAbs: new Decimal(pendingCashFromTransactions).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromTransactions).isPositive(),
                    },
                    Withdrawals: {
                        valueAbs: new Decimal(pendingCashFromWithdrawals).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromWithdrawals).isPositive(),
                    },
                    Deposits: {
                        valueAbs: new Decimal(pendingCashFromDeposits).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromDeposits).isPositive(),
                    },
                    Transfers: {
                        valueAbs: new Decimal(pendingCashFromTransfers).abs().toFixed(2).toString(),
                        isPositive: new Decimal(pendingCashFromTransfers).isPositive(),
                    }
                }
            }
        } else {
            return {
                valueAbs: "0.00",
                calculated: false
            }
        }
    }

    useEffect(() => {
        const getPendingMovements = async () => {
            var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams({
                client: ClientSelected.id,
                filterState: 1
            });

            setPendingMovements(prevState => ({
                ...prevState,
                ...{
                    fetching: true,
                }
            }))

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
                setPendingMovements(prevState => ({
                    ...prevState,
                    ...{
                        fetching: false,
                        fetched: true,
                        value: data.movements ? data.movements : []
                    }
                }))

            } else {
                switch (response.status) {
                    default:
                        console.log(response.status)
                        setPendingMovements(prevState => ({
                            ...prevState,
                            ...{
                                fetching: false,
                                fetched: false,
                            }
                        }))
                }
            }
        }
        const getPendingTransfers = async () => {
            var url = `${process.env.REACT_APP_APIURL}/transfers/?` + new URLSearchParams({
                client: ClientSelected.id,
                filterState: 1
            });

            setPendingTransfers(prevState => ({
                ...prevState,
                ...{
                    fetching: true,
                }
            }))

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
                setPendingTransfers(prevState => ({
                    ...prevState,
                    ...{
                        fetching: false,
                        fetched: true,
                        value: data.transfers ? data.transfers : []
                    }
                }))

            } else {
                switch (response.status) {
                    default:
                        console.log(response.status)
                        setPendingMovements(prevState => ({
                            ...prevState,
                            ...{
                                fetching: false,
                                fetched: false,
                            }
                        }))
                }
            }
        }

        getPendingMovements()
        getPendingTransfers()
    }, [token, ClientSelected.id])

    return (
        <Container className={`px-0 d-flex justify-content-center FundsContainerWidth cardsContainer p-relative`}>
            <Row ref={FundsContainer}
                className={`d-flex align-items-stretch mx-0 w-100 
                ${totalCards() < CardWidth ?
                        "justify-content-center" : ""}
                 pb-2 flex-wrap flex-sm-nowrap overflow-hidden `}>
                {
                    hasPermission('VIEW_ACCOUNT') ?
                        Accounts.map(
                            (account, key) =>
                                <CashCard cardsAmount={Funds.length + PendingWithoutpossession.length + shownFixedDeposits().length + 1}
                                    inScreenFunds={CardWidth} Pinned={Pinned} setPinned={setPinned}
                                    PendingTransactions={PendingTransactions} key={`account-${account.id || key}`} Hide={Hide} setHide={setHide} Fund={account}
                                    pendingCash={pendingCash}
                                    setShow={setShow}
                                    show={show}
                                />
                        )
                        :
                        null
                }
                {
                    hasPermission('VIEW_ACCOUNT') ?
                        Accounts.map(
                            (account, key) =>
                                <CashCardPinned cardsAmount={Funds.length + PendingWithoutpossession.length + shownFixedDeposits().length + 1}
                                    inScreenFunds={CardWidth} Pinned={Pinned} setPinned={setPinned}
                                    PendingTransactions={PendingTransactions} key={`account-pinned-${account.id || key}`} Hide={Hide} setHide={setHide} Fund={account}
                                    setShow={setShow}
                                    pendingCash={pendingCash}
                                />
                        )
                        :
                        null
                }
                {
                    Funds.map((fund, k) =>
                        <FundCard Hide={Hide} setHide={setHide} PendingTransactions={PendingTransactions}
                            setItemSelected={setItemSelected} Funds={Funds} Fund={fund} key={`fund-${fund?.id || k}`} />


                    )
                }
                {
                    PendingWithoutpossession.map((fund) =>
                        <FundCard Hide={Hide} setHide={setHide} key={`fund-withoutposession-card-${fund?.id}`} PendingTransactions={PendingTransactions}
                            setItemSelected={setItemSelected} Funds={Funds} Fund={fund} />
                    )
                }
                {
                    shownFixedDeposits().map((fixedDeposit, key) =>
                        <FixedDepositCard ownKey={key} key={`fixedDeposit-${fixedDeposit?.id || key}`} FixedDeposit={fixedDeposit} Hide={Hide} setHide={setHide} />
                    )
                }
            </Row>
            <div className={`arrow  right d-none d-sm-flex
                                ${totalCards() > 3 && showRightChevron ? "opacity-1" : ""}`}
                onClick={() => { if (showRightChevron) setScrollPositionByOffset(Offset + 1) }}>
                <img className="chevron" src={`${process.env.PUBLIC_URL}/images/chevron/chevron-right.svg`} alt='right' />
            </div>
            <div className={` arrow left d-none d-sm-flex
                                ${totalCards() > 3 && showLeftChevron ? "opacity-1" : ""}`}
                onClick={() => { if (showLeftChevron) setScrollPositionByOffset(Offset - 1) }}>
                <img className="chevron" src={`${process.env.PUBLIC_URL}/images/chevron/chevron-left.svg`} alt='left' />
            </div>
            <Indicators
                cardsAmount={totalCards()}
                inScreenFunds={CardWidth}
                offset={Offset} setScrollPositionByOffset={setScrollPositionByOffset}
            />
        </Container>

    )
}
export default CardsContainer
