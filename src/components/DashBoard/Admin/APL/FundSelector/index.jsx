import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap'

const FundSelector = ({ SelectedFund, setSelectedFund, Funds }) => {

    useEffect(() => {
        setSelectedFund(Funds?.[0].id)
    }, [Funds, setSelectedFund])

    return (
        <>
            <Row className='fund-selector'>
                {Funds.map((Fund, key) =>
                    <Col key={Fund.id} sm="10" md="4" lg="3" xl="3">
                        <button onClick={() => setSelectedFund(Fund.id)} key={key} className={`noStyle fund-item ${SelectedFund === Fund.id ? "selected" : ""}`}>
                            <div className='content-container'>
                                <h7 className="d-flex">
                                    {Fund.name}
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
                                </h7>
                            </div>
                        </button>
                    </Col>
                )}

            </Row>
        </>
    )
}
export default FundSelector