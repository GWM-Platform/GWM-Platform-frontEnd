import React, { useEffect, createRef, useState } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundCard from './FundCard';
import CashCard from './CashCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CardsContainer = ({ setItemSelected, Funds, Accounts, PendingTransactions, PendingWithoutpossession }) => {
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const [Hide, setHide] = useState(false)

    //For scrolling
    const FundsContainer = createRef()

    const isNull = () => {
        return (FundsContainer.current === null)
    }

    //Scrolling Function
    const scrollContainer = (right) => {
        let cardWidth = isNull() ? "" : FundsContainer.current.clientWidth / 3
        let next=FundsContainer.current.scrollLeft + cardWidth
        let prev=FundsContainer.current.scrollLeft - cardWidth
        if (!isNull()) {
            FundsContainer.current.scrollTo({
                top: 0,
                left: right ?next : prev,
                behavior: 'smooth'
            })
            if (right) {
                if (FundsContainer.current.scrollWidth - FundsContainer.current.clientWidth < next + 10) {
                    setShowRightChevron(false)
                }
                if (next > 10 && !showLeftChevron) {
                    setShowLeftChevron(true)
                }
            } else {
                if (prev< 10) {
                    setShowLeftChevron(false)
                }
                if (FundsContainer.current.scrollWidth - FundsContainer.current.clientWidth !== prev) {
                    setShowRightChevron(true)
                }
            }
        }
    }


    useEffect(() => {
        return () => {
        }
    }, [Funds,PendingWithoutpossession])

    return (
        <Container className="px-0 d-flex justify-content-center FundsContainerWidth cardsContainer p-relative">
            <Row ref={FundsContainer}
                className={`d-flex align-items-stretch ${Funds.length+PendingWithoutpossession.length < 3 ? "justify-content-center" : ""}
                w-100 g-1 g-sm-5 pb-2 flex-wrap flex-sm-nowrap overflow-hidden `}>
                {Accounts.map((account, key) => {
                    return (
                        <CashCard PendingTransactions={PendingTransactions} key={key} Hide={Hide} setHide={setHide} Fund={account} />
                    )
                })
                }
                {
                    Funds.map((j, k) => {
                        return (
                            <FundCard Hide={Hide} setHide={setHide} key={k} PendingTransactions={PendingTransactions}
                                setItemSelected={setItemSelected} Funds={Funds} Fund={j} />
                        )
                    }
                    )
                }
                {
                    PendingWithoutpossession.map((j, k) => {
                        return (
                            <FundCard Hide={Hide} setHide={setHide} key={k} PendingTransactions={PendingTransactions}
                                setItemSelected={setItemSelected} Funds={Funds} Fund={j} />
                        )
                    }
                    )
                }
            </Row>
            <div className={`arrow  right d-none d-sm-block
                                ${Funds.length + PendingWithoutpossession.length > 2 && showRightChevron ? "opacity-1" : ""}`}
                onClick={() => scrollContainer(true)}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className={` arrow left d-none d-sm-block
                                ${Funds.length + PendingWithoutpossession.length > 2 && showLeftChevron ? "opacity-1" : ""}`}
                onClick={() => scrollContainer(false)}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>
        </Container>

    )
}
export default CardsContainer
