import React, { useState, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container } from 'react-bootstrap'
import FundCard from './FundCard';
import { useTranslation } from "react-i18next";
import AccountCard from './AccountCard';
import "components/DashBoard/Admin/ClientsSupervision/SelectedClientData/index.scss"
import { ScrollControl } from '../../BuyForm/FundSelector';

const FundSelector = ({ data, setData, Funds, openAccordion, showAccount = false, showPrice = true }) => {
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
        const el = accountsSlider?.current;
        if (el) {
            const children = Array.from(el.querySelectorAll('.FundCardContainer'));
            const containerRect = el.getBoundingClientRect();
            // Ordenar los hijos basándose en su posición visual
            const orderedChildren = children.sort((a, b) => {
                const rectA = a.getBoundingClientRect();
                const rectB = b.getBoundingClientRect();
                return rectA.left - rectB.left;
            });

            const visibleChild = orderedChildren.find(child => {
                const rect = child.getBoundingClientRect();
                return rect.left >= containerRect.left && rect.right <= containerRect.right;
            });

            if (visibleChild) {
                const currentIndex = orderedChildren.indexOf(visibleChild);
                const nextIndex = right ? currentIndex + 1 : currentIndex - 1;

                if (nextIndex >= 0 && nextIndex < orderedChildren.length) {
                    const nextChild = orderedChildren[nextIndex];
                    nextChild.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            } else {
                el.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        }
    };
    //For scrolling

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
                        <Row className="mx-0 d-flex justify-content-center">
                            <div className='p-relative px-0'>

                                <div ref={accountsSlider} className='fund-selector' onScroll={handleScroll} >
                                    {
                                        showAccount &&
                                        <AccountCard accountCardRef={accountCard} data={data} setData={setData} openAccordion={openAccordion} />
                                    }
                                    {Funds.map((Fund, key) => {
                                        return (
                                            <FundCard accountCardRef={(key === 0 && !showAccount) ? accountCard : null} showPrice={showPrice} openAccordion={openAccordion} key={key} ownKey={key}
                                                Fund={Fund} data={data} setData={setData} />
                                        )
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