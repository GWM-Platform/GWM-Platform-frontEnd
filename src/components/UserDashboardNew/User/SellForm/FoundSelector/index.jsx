import React, { createRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container } from 'react-bootstrap'
import FoundCard from './FoundCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";

const FoundSelector = ({ handleSwitch, SwitchState, data, setData, some, setSome, founds }) => {
    const { t } = useTranslation();
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)

    //For scrolling
    const foundsContainer = createRef()

    const isNull = () => {
        return (foundsContainer.current === null)
    }

    //Scrolling Function
    const scrollFoundContainer = (right) => {
        let cardWidth = isNull() ? "" : foundsContainer.current.clientWidth / 4
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
                                {t("Select Found To sell")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <div className="formSection">
                    <Form.Check
                        onChange={handleSwitch}
                        value={SwitchState}
                        type="switch"
                        id="foundApi"
                        label={t("API's founds (For devops)")}
                    />
                    <Row className="d-flex justify-content-center">
                        <div className="p-relative">
                            <Row className="flex-row flex-nowrap overflow-hidden" ref={foundsContainer}>
                                {founds.map((found, key) => {
                                    return (
                                        <FoundCard key={key} ownKey={key} found={found} data={data} setData={setData} some={some} setSome={setSome} />
                                    )
                                })}
                            </Row>
                            <div className={`arrow  right d-none d-sm-block
                                ${founds.length > 3 && showRightChevron ? "opacity-1" : ""}`}
                                onClick={() => scrollFoundContainer(true)}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className={` arrow left d-none d-sm-block
                                ${founds.length > 3 && showLeftChevron ? "opacity-1" : ""}`}
                                onClick={() => scrollFoundContainer(false)}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </div>
                        </div>
                    </Row>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default FoundSelector