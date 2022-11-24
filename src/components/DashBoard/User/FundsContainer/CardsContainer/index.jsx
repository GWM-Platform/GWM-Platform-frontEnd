import React, { useEffect, createRef, useState, useContext } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundCard from './FundCard';
import CashCard from './CashCard';
import { DashBoardContext } from 'context/DashBoardContext';
import Indicators from './Indicators'
import './index.css'
import FixedDepositCard from './FixedDepositCard';

const CardsContainer = ({ setItemSelected, Funds, Accounts, PendingTransactions, PendingWithoutpossession, FixedDeposits }) => {
    const { width, hasPermission } = useContext(DashBoardContext)

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

    return (
        <Container className={`px-0 d-flex justify-content-center FundsContainerWidth cardsContainer p-relative`}>
            <Row ref={FundsContainer}
                className={`d-flex align-items-stretch mx-0 w-100 
                ${totalCards() < CardWidth ?
                        "justify-content-center" : ""}
                 pb-2 flex-wrap flex-sm-nowrap overflow-hidden `}>
                {
                    hasPermission('VIEW_ACCOUNT') &&
                    <>
                        {
                            Accounts.map(
                                (account) =>
                                    <CashCard cardsAmount={totalCards()}
                                        inScreenFunds={CardWidth} Pinned={Pinned} setPinned={setPinned}
                                        PendingTransactions={PendingTransactions} key={`account-card-${account?.id}`} Hide={Hide} setHide={setHide} Fund={account} />
                            )
                        }
                    </>
                }
                {
                    Funds.map((fund) =>
                        <FundCard Hide={Hide} setHide={setHide} key={`fund-card-${fund?.id}`} PendingTransactions={PendingTransactions}
                            setItemSelected={setItemSelected} Funds={Funds} Fund={fund} />


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
                        <FixedDepositCard ownKey={key} key={`fixedDeposit-${fixedDeposit?.id}`} FixedDeposit={fixedDeposit} Hide={Hide} setHide={setHide} />
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
