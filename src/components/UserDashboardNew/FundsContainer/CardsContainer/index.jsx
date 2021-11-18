import React, { useEffect, createRef, useState } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundCard from './FundCard';
import CashCard from './CashCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CardsContainer = ({ setItemSelected, SwitchState, handleSwitch, Funds, Accounts }) => {
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const [Hide, setHide] = useState(false)

    //For scrolling
    const FundsContainer = createRef()

    const isNull = () => {
        return (FundsContainer.current === null)
    }

    //Scrolling Function
    const scrollFundContainer = (right) => {
        let cardWidth = isNull() ? "" : FundsContainer.current.clientWidth / 3
        if (right) {
            let scrollAmount = 0;
            let slideTimer = setInterval(function () {
                if (!isNull()) {
                    FundsContainer.current.scrollLeft += 15;
                    scrollAmount += 15;
                }
                if (!isNull() && scrollAmount >= cardWidth) {
                    window.clearInterval(slideTimer);
                    if (isNull() ? false : FundsContainer.current.scrollLeft !== 0 && !showLeftChevron) {
                        setShowLeftChevron(true)
                    } else if (isNull() ? false : FundsContainer.current.scrollWidth
                        - FundsContainer.current.clientWidth === FundsContainer.current.scrollLeft) {
                        setShowRightChevron(false)
                        setShowLeftChevron(true)
                    }
                }
            }, 25);
        } else {
            let scrollAmount = 0;
            let slideTimer = setInterval(function () {
                if (!isNull()) {
                    FundsContainer.current.scrollLeft -= 15;
                    scrollAmount += 15;
                }
                if (!isNull() && scrollAmount >= cardWidth) {
                    window.clearInterval(slideTimer);
                    if (isNull() ? false : FundsContainer.current.scrollLeft === 0 && showLeftChevron) {
                        setShowLeftChevron(false)
                        setShowRightChevron(true)
                    } else if (isNull() ? false : FundsContainer.current.scrollWidth
                        - FundsContainer.current.clientWidth !== FundsContainer.current.scrollLeft) {
                        setShowRightChevron(true)
                    }
                }
            }, 25);
        }
    }

    useEffect(() => {
        return () => {
        }
    }, [Funds])

    return (
        <Container className="px-0 d-flex justify-content-center accountsContainerWidth cardsContainer p-relative">
            <Row ref={FundsContainer}
                className={`d-flex align-items-stretch ${Funds.length < 3 ? "justify-content-center" : ""}
                w-100 g-1 g-sm-5 pb-2 flex-wrap flex-sm-nowrap overflow-hidden `}>
                {Accounts.map((account, key) => {
                    return (
                        <CashCard key={key} Hide={Hide} setHide={setHide} SwitchState={SwitchState} handleSwitch={handleSwitch} Fund={account} />
                    )
                })
                }
                {
                    Funds.map((j, k) => {
                        return (
                            <FundCard Hide={Hide} setHide={setHide} SwitchState={SwitchState} key={k}
                                setItemSelected={setItemSelected} Funds={Funds} Fund={j} />
                        )
                    }
                    )
                }

            </Row>
            <div className={`arrow  right d-none d-sm-block
                                ${Funds.length > 2 && showRightChevron ? "opacity-1" : ""}`}
                onClick={() => scrollFundContainer(true)}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className={` arrow left d-none d-sm-block
                                ${Funds.length > 2 && showLeftChevron ? "opacity-1" : ""}`}
                onClick={() => scrollFundContainer(false)}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>
        </Container>

    )
}
export default CardsContainer
