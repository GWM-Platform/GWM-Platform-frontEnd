import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Form } from 'react-bootstrap'
import OperationForm from './OperationForm';

const label = (data) => {
    switch (data.type) {
        case 0:
            return "Select found"
        case 1:
            return "Sell"
        case 2:
            return "Deposit"
        case 3:
            return "Withdraw"
        default:
            return ""
    }
}

const OperationFormContainer = ({ types, data, setData, some, setSome, setOpen, open }) => {
    return (
        <div className="formSection">
            <Row className="d-flex justify-content-center">
                <Form.Label className="mb-3 pt-0 label d-flex align-items-center" column sm="auto">
                    <div className="d-inline-block numberContainer">
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <span className="number">2</span>
                        </div>
                    </div>
                    {label(data)}
                </Form.Label>
                <OperationForm data={data} setData={setData} some={some} setSome={setSome} />
            </Row>
        </div>
    )
}
export default OperationFormContainer