import React, { createRef, useState,useContext,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container } from 'react-bootstrap'
import FundCard from './FundCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { dashboardContext } from '../../../../../../context/dashboardContext';

const FundSelector = ({ data, setData, some, setSome, Funds,openAccordion }) => {
    const { t } = useTranslation();
    const [CardWidth, setCardWidth] = useState(false)
    const [Offset, setOffset] = useState(0)
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const { width } = useContext(dashboardContext)

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
            let maxOffset = Funds.length - 1 - CardWidth
            let toSetOffset = offset > maxOffset ? maxOffset : offset
            setShowRightChevron(toSetOffset !== maxOffset)
            setShowLeftChevron(toSetOffset !== 0)
            setOffset(toSetOffset)
        }
    }

    useEffect(() => {
        if (width < 578) {
            setCardWidth(10)
        } else {
            setCardWidth(3)
        }
    }, [width])

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
                                {t("Select Fund To sell")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <div className="formSection">
                    <Row className="d-flex justify-content-center">
                        <div className="p-relative">
                            <Row className="flex-row flex-nowrap overflow-overlay overflow-sm-hidden" ref={FundsContainer}>
                                {Funds.map((Fund, key) => {
                                    return (
                                        <FundCard openAccordion={openAccordion} key={key} ownKey={key} 
                                        Fund={Fund} data={data} setData={setData} some={some} setSome={setSome} />
                                    )
                                })}
                            </Row>
                            <div className={`arrow  right d-none d-sm-block
                                ${Funds.length > 3 && showRightChevron ? "opacity-1" : ""}`}
                                onClick={() => { if (showRightChevron) setScrollPositionByOffset(Offset + 1) }}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className={` arrow left d-none d-sm-block
                                ${Funds.length > 3 && showLeftChevron ? "opacity-1" : ""}`}
                                onClick={() => { if (showLeftChevron) setScrollPositionByOffset(Offset - 1) }}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </div>
                        </div>
                    </Row>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default FundSelector