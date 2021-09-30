import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import OperationType from './OperationType'

import { Container, Row, Col, Collapse } from 'react-bootstrap'
import OperationFormContainer from './OperationFormContainer';

const CreatNewTicket = () => {
    const [data, setData] = useState({})
    const [some, setSome] = useState(false)
    const [open, setOpen] = useState(false)
    const types = ["buy", "sell", "deposit", "withdraw"]

    useEffect(() => {

        return () => {

        }
    }, [data, some])

    return (
        <Container >
            <Row className="min-free-area newTicket">
                <Col md={12} lg={9}>
                    <OperationType data={data} setData={setData} some={some} setSome={setSome} setOpen={setOpen} open={open} types={types}/>
                    <Collapse in={open}
                        onExited={function () {
                            setTimeout(() => {
                                setOpen(!open);
                            }, 250);
                        }}>
                        <div>
                            <OperationFormContainer types={types} data={data} setData={setData} some={some} setSome={setSome} />
                        </div>
                    </Collapse>
                </Col>
                <Col sm={3} className="d-none d-lg-block">

                </Col>
            </Row>
        </Container>
    )
}
export default CreatNewTicket