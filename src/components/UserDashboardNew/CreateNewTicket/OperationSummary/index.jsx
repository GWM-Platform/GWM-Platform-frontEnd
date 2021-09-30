import React,{useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import OperationType from './OperationType'

import {Container,Row,Col} from 'react-bootstrap'

const CreatNewTicket = ({operationSelected}) => {
    const [data,setData]=useState({})

    return (
        <Container>
            <h1>
                Operation<span className="font-weight-bold">{operationSelected}</span>
            </h1>
        </Container>
    )
}
export default CreatNewTicket