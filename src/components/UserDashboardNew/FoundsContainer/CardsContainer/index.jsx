import React, { useEffect, createRef, useState } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FoundCard from './FoundCard';
import CashCard from './CashCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CardsContainer = ({ setItemSelected, SwitchState, handleSwitch, founds, cash }) => {
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const [Hide, setHide] = useState(false)

    //For scrolling
    const foundsContainer = createRef()

    const isNull = () => {
        return (foundsContainer.current === null)
    }

    //Scrolling Function
    const scrollFoundContainer = (right) => {
        let cardWidth = isNull() ? "" : foundsContainer.current.clientWidth / 3
        if (right) {
            let scrollAmount = 0;
            let slideTimer = setInterval(function () {
                if (!isNull()) {
                    foundsContainer.current.scrollLeft += 15;
                    scrollAmount += 15;
                }
                if (!isNull() && scrollAmount >= cardWidth) {
                    window.clearInterval(slideTimer);
                    if (isNull() ? false : foundsContainer.current.scrollLeft !== 0 && !showLeftChevron) {
                        setShowLeftChevron(true)
                    } else if (isNull() ? false : foundsContainer.current.scrollWidth
                        - foundsContainer.current.clientWidth === foundsContainer.current.scrollLeft) {
                        setShowRightChevron(false)
                        setShowLeftChevron(true)
                    }
                }
            }, 25);
        } else {
            let scrollAmount = 0;
            let slideTimer = setInterval(function () {
                if (!isNull()) {
                    foundsContainer.current.scrollLeft -= 15;
                    scrollAmount += 15;
                }
                if (!isNull() && scrollAmount >= cardWidth) {
                    window.clearInterval(slideTimer);
                    if (isNull() ? false : foundsContainer.current.scrollLeft === 0 && showLeftChevron) {
                        setShowLeftChevron(false)
                        setShowRightChevron(true)
                    } else if (isNull() ? false : foundsContainer.current.scrollWidth
                        - foundsContainer.current.clientWidth !== foundsContainer.current.scrollLeft) {
                        setShowRightChevron(true)
                    }
                }
            }, 25);
        }
    }

    useEffect(() => {
        return () => {
        }
    }, [founds])

    return (
        <Container className="px-0 d-flex justify-content-center accountsContainerWidth cardsContainer p-relative">
            <Row ref={foundsContainer}
                className={`d-flex align-items-stretch ${founds.length < 3 ? "justify-content-center" : ""}
                w-100 g-1 g-sm-5 pb-2 flex-wrap flex-sm-nowrap overflow-hidden `}>
                <CashCard Hide={Hide} setHide={setHide}  SwitchState={SwitchState} handleSwitch={handleSwitch} found={cash} />
                {
                    founds.map((j, k) => {
                        return (
                            <FoundCard Hide={Hide} setHide={setHide} SwitchState={SwitchState} key={k}
                                setItemSelected={setItemSelected} founds={founds} found={j} />
                        )
                    }
                    )
                }

            </Row>
            <div className={`arrow  right d-none d-sm-block
                                ${founds.length > 2 && showRightChevron ? "opacity-1" : ""}`}
                onClick={() => scrollFoundContainer(true)}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className={` arrow left d-none d-sm-block
                                ${founds.length > 2 && showLeftChevron ? "opacity-1" : ""}`}
                onClick={() => scrollFoundContainer(false)}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>
        </Container>

    )
}
export default CardsContainer
