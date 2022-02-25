import React from 'react'
import {  Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Indicator = ({ selected,setSelfPositionScroll }) => {
    return (
        <Col>
            <div onClick={()=>setSelfPositionScroll()}className={`indicator ${ selected ? "selected": "" }`} />
        </Col>

    )
}
export default Indicator
