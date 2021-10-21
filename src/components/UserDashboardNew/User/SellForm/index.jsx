import React, { useState, useEffect, createRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Container, Row, Col, Form } from 'react-bootstrap'
import FoundCard from './FoundCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";


const SellForm = () => {
    const [data, setData] = useState({})
    const [some, setSome] = useState(false)
    const { t } = useTranslation();

    useEffect(() => {

        return () => {

        }
    }, [data, some])

    //HardCoded data (here we should request founds that have available feeParts to sell)
    const founds = [{
        name: "CryptoCurrency found",
        totalFeeParts: 1000,
        feePartsAvalilable: 37,
        feePartsValue: 30,
        composition: [{
            label: 'Bitcoin USD',
            value: 15
        }, {
            label: 'Ethereum USD',
            value: 5
        }, {
            label: 'HEX USD',
            value: 7
        }, {
            label: 'Tether USD',
            value: 0.2
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'BinanceCoin US',
            value: 15
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]
    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 1000,
        feePartsAvalilable: 37,
        feePartsValue: 30,
        composition: [{
            label: 'Bitcoin USD',
            value: 15
        }, {
            label: 'Ethereum USD',
            value: 5
        }, {
            label: 'HEX USD',
            value: 7
        }, {
            label: 'Tether USD',
            value: 0.2
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'BinanceCoin US',
            value: 15
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]
    }]
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
        <Container >
            <Row className="min-free-area newTicket">
                <Col sm="auto">
                    <div className="formSection">
                        <Row className="d-flex justify-content-center">
                            <Form.Label className="mb-3 pt-0 label d-flex align-items-center" column sm="auto">
                                <div className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">1</span>
                                    </div>
                                </div>
                                {t("Select Found To Sell")}
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
                </Col>
            </Row>
        </Container>
    )
}
export default SellForm