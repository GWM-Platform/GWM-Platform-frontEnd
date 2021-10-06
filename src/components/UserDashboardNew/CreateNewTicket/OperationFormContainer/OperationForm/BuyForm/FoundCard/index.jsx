import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import DonutChart from 'react-donut-chart';
import './index.css'
import { Col, Card} from 'react-bootstrap'

const FoundCard = ({ found, ownKey, data, setData,setSome,some  }) => {
    return (
        <Col sm="3" className="py-1">
            <Card
                className={`text-center foundCard ${data.foundSelected===ownKey ? "foundSelected" : ""}`}
                onClick={()=>{setFoundSelected(data, setData, ownKey,setSome,some)}}>
                <Card.Header><strong className="title">{found.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>FeeParts value: <strong>${found.feePartsValue}</strong></Card.Title>

                    <Card.Text className="mb-1">
                        <strong>{found.feePartsAvalilable}</strong> FeeParts available

                    </Card.Text>

                    <Card.Text className="mb-1">
                        <strong>{found.totalFeeParts}</strong> Feeparts in total
                    </Card.Text>

                    <DonutChart
                        className="d-block w-100"
                        legend={false}
                        data={found.composition}
                        colors={['#FFA07A','#FA8072','#E9967A','#F08080','#CD5C5C','#DC143C','#B22222','#FFO000','#8B0000','#800000','#FF6347','#FF4500','#DB7093']}
                        height={200}
                        width={200} />
                </Card.Body>
            </Card>
        </Col>
    )
}

const setFoundSelected = (data, setData, ownKey,setSome,some) => {
        let aux = data
        aux.foundSelected = ownKey
        setData(aux)
        setSome(!some)
}

export default FoundCard