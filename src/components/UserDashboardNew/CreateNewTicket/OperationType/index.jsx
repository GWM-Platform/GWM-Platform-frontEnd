import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Type from './Type'
import { Container, Row, Col, Form } from 'react-bootstrap'

const OperationType = ({data,setData,some,setSome,setOpen,open,types}) => {
    return (
        <div className="formSection">
            <Row className="d-flex justify-content-center">
                <Form.Label className="mb-3 pt-0 label d-flex align-items-center"column sm="auto">
                    <div className="d-inline-block numberContainer">
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <span className="number">1</span>
                        </div>
                    </div>
                    Operation
                </Form.Label>
            </Row>

            <Row className="d-flex justify-content-center">
                <Col sm={12} md={12} lg={10} xl={8}>
                    <Container className="px-0" fluid>
                        <Row className="flex-row flex-nowrap overflow-auto align-items-center">
                            {types.map((type, key) => {
                                return (
                                    <Type
                                        some={some} 
                                        setSome={setSome}
                                        setOpen={setOpen}
                                        type={type}
                                        data={data}
                                        setData={setData}
                                        ownKey={key}
                                        key={key}
                                        open={open}
                                    />)

                            })}
                        </Row>
                    </Container>
                </Col>
            </Row>
        </div>
    )
}
export default OperationType