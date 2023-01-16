import React, { createRef, useState, useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container } from 'react-bootstrap'
import RuleCard from './RuleCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

const RuleSelector = ({ data, setData, RulesObject }) => {
    const { t } = useTranslation();
    const [CardWidth, setCardWidth] = useState(false)
    const [Offset, setOffset] = useState(0)
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const { width } = useContext(DashBoardContext)

    const Rules = Object.keys(RulesObject?.interest || {}).sort()
    //For scrolling
    const RulesContainer = createRef()

    const isNull = () => !RulesContainer.current

    //Scrolling Function
    const setScrollPositionByOffset = (offset) => {
        if (!isNull()) {
            let widthScroll =
                isNull() ?
                    "" :
                    CardWidth ?
                        RulesContainer.current.clientWidth / CardWidth :
                        RulesContainer.current.clientWidth / 3
            let scroll = widthScroll * offset
            RulesContainer.current.scrollTo({
                top: 0,
                left: scroll,
                behavior: 'smooth'
            })
            let maxOffset = Rules.length - 1 - CardWidth
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
            setCardWidth(4)
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
                            <div className="p-relative px-0">
                                <Container fluid className="px-0">
                                    <Row className="mx-0 flex-row flex-nowrap  overflow-auto overflow-sm-hidden RuleCardsContainer" ref={RulesContainer}>
                                        {Rules.map((Rule, index) => {
                                            return (
                                                <RuleCard key={`Rule-${index}`} Rule={Rule} data={data} setData={setData} index={index} Rules={Rules} RulesObject={RulesObject} />
                                            )
                                        })}
                                    </Row>
                                </Container>
                                <div className={`arrow  right d-none d-sm-block
                                ${Rules.length > 3 && showRightChevron ? "opacity-1" : ""}`}
                                    onClick={() => { if (showRightChevron) setScrollPositionByOffset(Offset + 1) }}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div className={` arrow left d-none d-sm-block
                                ${Rules.length > 3 && showLeftChevron ? "opacity-1" : ""}`}
                                    onClick={() => { if (showLeftChevron) setScrollPositionByOffset(Offset - 1) }}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default RuleSelector