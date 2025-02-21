import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const FundSelector = ({ SelectedFund, setSelectedFund, Funds, clientFunds = [] }) => {

    const { t } = useTranslation();

    useEffect(() => {
        setSelectedFund(Funds?.[0].id)
    }, [Funds, setSelectedFund])

    const accountsSlider = useRef(null)
    const accountCard = useRef(null)

    // const [HasScrollBar, setHasScrollBar] = useState(false)
    const [ScrollBarSides, setScrollBarSides] = useState({
        left: false,
        right: true
    })

    // useEffect(() => {
    //     function updateState() {
    //         const el = accountsSlider.current
    //         el && setHasScrollBar(el.scrollWidth > el.clientWidth)
    //     }

    //     updateState()

    //     window.addEventListener('resize', updateState)
    //     return () => window.removeEventListener('resize', updateState)
    // }, [Funds])

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
            const children = Array.from(el.querySelectorAll('.scrollable-item'));
            const containerRect = el.getBoundingClientRect();
            const visibleChild = children.find(child => {
                const rect = child.getBoundingClientRect();
                return rect.left >= containerRect.left && rect.right <= containerRect.right;
            });

            if (visibleChild) {
                const currentIndex = children.indexOf(visibleChild);
                const nextIndex = right ? currentIndex + 1 : currentIndex - 1;

                if (nextIndex >= 0 && nextIndex < children.length) {
                    const nextChild = children[nextIndex];
                    el.scrollTo({
                        top: 0,
                        left: nextChild.offsetLeft,
                        behavior: 'smooth'
                    });
                }
            } else {
                el.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        }
    }

    return (
        <>
            <div className='p-relative'>

                <div ref={accountsSlider} className='fund-selector' onScroll={handleScroll} >
                    {
                        Funds.map((Fund, key) => {
                            const stake = clientFunds?.find(clientFund => clientFund?.fundId === Fund?.id)
                            return (
                                <Col className="scrollable-item" key={Fund.id} sm="10" md="4" lg="3" xl="3" ref={key === 0 ? accountCard : undefined}>
                                    <button onClick={() => setSelectedFund(Fund.id)} key={key} className={`noStyle fund-item ${SelectedFund === Fund.id ? "selected" : ""}`}>
                                        <div className='content-container'>
                                            <div className="d-flex">
                                                <span>
                                                    {Fund.name}
                                                    {
                                                        stake ?
                                                            <>
                                                                <br />
                                                                <FormattedNumber value={Decimal(stake?.shares || 0).times(stake?.fund?.sharePrice || 0).toFixed(2)} prefix="U$D " fixedDecimals={2} />
                                                            </>
                                                            :
                                                            <>
                                                                <br />
                                                                {t("(No holdings)")}
                                                            </>
                                                    }
                                                </span>
                                                <div className="fund-icon ms-auto">
                                                    {
                                                        <img alt=""
                                                            onError={({ currentTarget }) => {
                                                                currentTarget.onerror = null;
                                                                currentTarget.src = process.env.PUBLIC_URL + '/images/FundsLogos/default.svg';
                                                            }}
                                                            src={Fund.imageUrl ? Fund.imageUrl : process.env.PUBLIC_URL + '/images/FundsLogos/default.svg'} />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </Col>
                            )
                        })
                    }
                    {
                        // !!(HasScrollBar) &&
                        <ScrollControl scroll={scroll} ScrollBarSides={ScrollBarSides} />
                    }
                </div>
            </div>

        </>
    )
}
export default FundSelector

const ScrollControl = ({ ScrollBarSides, scroll }) => {
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