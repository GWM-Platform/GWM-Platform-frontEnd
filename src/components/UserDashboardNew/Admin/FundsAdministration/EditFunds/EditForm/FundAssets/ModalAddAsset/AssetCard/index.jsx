import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col } from 'react-bootstrap'

const AssetCard = ({ Asset, ownKey, AssetSelected ,setAssetSelected}) => {
    console.log(Asset)
    return (
        <Col xs="auto" className="assetCard containerCard">
            <Card onClick={()=>{setAssetSelected(ownKey)}}
                className={`AssetCard h-100 ${AssetSelected === ownKey ? "FundSelected" : ""}`}>
                <Card.Header><strong className="title">{Asset.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Text className="mb-1 feePartsInfo">
                        <strong>${Asset.value}</strong>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>

    )
}

export default AssetCard
