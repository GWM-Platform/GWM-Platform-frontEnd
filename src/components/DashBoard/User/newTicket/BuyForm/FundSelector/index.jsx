import React, { useState, useRef, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container } from 'react-bootstrap'
import FundCard from './FundCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import "components/DashBoard/Admin/ClientsSupervision/SelectedClientData/index.scss"
const FundSelector = ({ data, setData, Funds, openAccordion, Account }) => {
    const { t } = useTranslation();

    const accountsSlider = useRef(null)
    const accountCard = useRef(null)

    const [ScrollBarSides, setScrollBarSides] = useState({
        left: false,
        right: true
    })
    const handleScroll = (e) => {
        setScrollBarSides(prevState => (
            {
                ...prevState,
                left: e.target.scrollLeft !== 0,
                right: e.target.scrollLeft !== e.target.scrollWidth - e.target.clientWidth
            }
        ))
    }

    const scroll = (right = true) => {
        const el = accountsSlider?.current
        if (el) {
            accountsSlider.current.scrollTo({
                top: 0,
                left: el.scrollLeft + (accountCard?.current.clientWidth || 200) * (right ? 1 : -1),
                behavior: 'smooth'
            })
        }
    }

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">1</span>
                                    </div>
                                </span>
                                {t("Choose a product")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <div className="formSection">
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-center mx-0">
                            <div className='p-relative px-0'>

                                <div ref={accountsSlider} className='fund-selector' onScroll={handleScroll} >
                                    {Funds.map((Fund, key) => {
                                        return <FundCard
                                            accountCardRef={key === 0 ? accountCard : null}
                                            Account={Account} openAccordion={openAccordion} key={key} ownKey={key}
                                            Fund={Fund} data={data} setData={setData} />
                                    })}
                                    {
                                        // !!(HasScrollBar) &&
                                        <ScrollControl scroll={scroll} ScrollBarSides={ScrollBarSides} />
                                    }
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default FundSelector

export const ScrollControl = ({ ScrollBarSides, scroll }) => {
    // check if the parent has overflow
    useEffect(() => {
        const timeout = setTimeout(() => {
            const scrollController = document.getElementsByClassName('scrollController')?.[0]
            // get parent
            const parent = scrollController?.parentElement
            // check if parent has overflow
            if (parent) {
                if (parent.scrollWidth === parent.clientWidth) {
                    scrollController.classList.add('invisible')
                } else {
                    scrollController.classList.remove('invisible')
                }
            }
        }, 250);
        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className={`scrollController ${!!(ScrollBarSides?.left) && 'scrollLeft'} ${!!(ScrollBarSides?.right) && 'scrollRight'}`} >
            <button onClick={() => scroll(false)} type="button" className={`control  left ${!(ScrollBarSides?.left) && 'hidden'}`} data-cy="btn-scroll-prev-accounts">
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button onClick={() => scroll()} type="button" className={`control right ${!(ScrollBarSides?.right) && 'hidden'}`} data-cy="btn-scroll-next-accounts">
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    )
}