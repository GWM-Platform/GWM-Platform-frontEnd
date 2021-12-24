import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const AddAsset = ({launch}) => {
    return (
        <Card className="col-1" onClick={launch}>
            <Card.Body className="h-100 d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={faPlusCircle}/>
            </Card.Body>
        </Card>
    )
}

export default AddAsset