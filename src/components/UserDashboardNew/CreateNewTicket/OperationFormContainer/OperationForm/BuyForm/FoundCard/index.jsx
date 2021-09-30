import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card } from 'react-bootstrap'

const FoundCard = ({ found }) => {
    console.log(found.composition)
    return (
        <Col sm="6">
            <Card className="text-center foundCard">
                <Card.Header><strong className="title">{found.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>FeeParts value: ${found.feePartsValue}</Card.Title>

                    <Card.Text className="mb-1">
                        {found.feePartsAvalilable} FeeParts available

                    </Card.Text>

                    <Card.Text className="mb-1">
                        {found.totalFeeParts} Feeparts in total 
                    </Card.Text>

                    <DonutChart
                    className="d-block w-100"                        
                        legend={false}
                        data={found.composition}
                        height={200}
                        width={200} />
                </Card.Body>
            </Card>
        </Col>
    )
}
export default FoundCard