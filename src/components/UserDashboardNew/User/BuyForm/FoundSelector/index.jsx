import React, { createRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row,Form } from 'react-bootstrap'
import FoundCard from './FoundCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";

const FoundSelector = ({ data, setData, some, setSome,founds }) => {
    const { t } = useTranslation();

   
    //For scrolling
    const foundsContainer = createRef()

    //Scrolling Function
    const scrollFoundContainer = (right) => {
        let cardWidth=foundsContainer.current.clientWidth/4
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

    return (
        <div className="formSection">
            <Row className="d-flex justify-content-center">
                <Form.Label className="mb-3 pt-0 label d-flex align-items-center" column sm="auto">
                    <div className="d-inline-block numberContainer">
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <span className="number">1</span>
                        </div>
                    </div>
                    {t("Select Found To buy")}
                </Form.Label>
                <div className="p-relative">
                    <Row className="flex-row flex-nowrap overflow-auto" ref={foundsContainer}>
                        {founds.map((found, key) => {
                            return (
                                <FoundCard key={key} ownKey={key} found={found} data={data} setData={setData} some={some} setSome={setSome} />
                            )
                        })}
                    </Row>
                    <div className="arrow right" onClick={() => scrollFoundContainer(true)}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                    <div className="arrow left" onClick={() => scrollFoundContainer(false)}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                </div>
            </Row>
        </div>
    )
}
export default FoundSelector