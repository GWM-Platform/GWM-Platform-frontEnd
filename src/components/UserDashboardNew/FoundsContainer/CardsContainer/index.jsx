import React, { useEffect, createRef,useState } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FoundCard from './FoundCard';
import CashCard from './CashCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CardsContainer = ({ setItemSelected, SwitchState, handleSwitch, founds, cash }) => {
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
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
        <Container className="d-flex justify-content-center accountsContainerWidth cardsContainer p-relative">
            <Row ref={foundsContainer}
                className="w-100 flex-nowrap overflow-hidden d-flex align-items-stretch g-5 ">
                <CashCard SwitchState={SwitchState} handleSwitch={handleSwitch} found={cash} />
                {
                    founds.map((j, k) => {
                        return (
                            <FoundCard SwitchState={SwitchState} key={k} setItemSelected={setItemSelected} founds={founds} found={j} />
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
