import React, { useEffect, createRef } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FoundCard from './FoundCard';
import CashCard from './CashCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CardsContainer = ({ setItemSelected,SwitchState,handleSwitch, founds,cash }) => {
    //For scrolling
    const foundsContainer = createRef()
    //Scrolling Function
    const scrollFoundContainer = (right) => {
        let cardWidth = foundsContainer.current.clientWidth / 3
        if (right) {
            let scrollAmount = 0;
            let slideTimer = setInterval(function () {
                foundsContainer.current.scrollLeft += 15;
                scrollAmount += 15;
                if (scrollAmount >= cardWidth) {
                    window.clearInterval(slideTimer);
                }
            }, 25);
        } else {
            let scrollAmount = 0;
            let slideTimer = setInterval(function () {
                foundsContainer.current.scrollLeft -= 15;
                scrollAmount += 15;
                if (scrollAmount >= cardWidth) {
                    window.clearInterval(slideTimer);
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
            <div className="d-none d-sm-block arrow right" onClick={() => scrollFoundContainer(true)}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="d-none d-sm-block arrow left" onClick={() => scrollFoundContainer(false)}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>
        </Container>

    )
}
export default CardsContainer
