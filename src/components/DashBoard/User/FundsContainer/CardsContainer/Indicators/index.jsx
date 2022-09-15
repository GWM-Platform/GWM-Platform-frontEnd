import React from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Indicator from './Indicator'

const Indicators = ({ cardsAmount, offset = 0, inScreenFunds, setScrollPositionByOffset }) => {
    return (
        <Row className={`indicators justify-content-center g-0 d-none ${cardsAmount > inScreenFunds ? "d-sm-flex" : "d-sm-none"}`}>
            <Container>
                <Row className="gx-1">
                    {[...Array(cardsAmount)].map((x, i) =>
                        <Indicator setSelfPositionScroll={() => setScrollPositionByOffset(i)} key={i} selected={offset <= i && i < inScreenFunds + offset} />
                    )}
                </Row>
            </Container>
        </Row>
    )
}
export default Indicators
