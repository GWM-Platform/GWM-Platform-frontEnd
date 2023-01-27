import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col } from 'react-bootstrap'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const AssetCard = ({ Asset }) => {
    const { token } = useContext(DashBoardContext)


    const [AssetDetail, setAssetDetail] = useState({
        "id": 0,
        "typeId": 0,
        "name": "",
        "value": 0,
    })

    useEffect(() => {
        const getAssets = async () => {
            var url = `${process.env.REACT_APP_APIURL}/assets/${Asset.assetId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setAssetDetail(data)
            } else {
                switch (response.status) {
                    default:
                        console.error(response.status)
                }
            }
        }
        getAssets()
    }, [Asset])



    return (
        <Col xs="auto" className="assetCard containerCard">
            <Card className={`AssetCard h-100 `}>
                <Card.Header><strong className="title">{Asset.name}</strong></Card.Header>
                <Card.Body>
                    <Card.Text className="mb-1 sharesInfo">
                        <strong>{AssetDetail.name}</strong>
                        <br/>
                        <strong>${Asset.amount*AssetDetail.value}</strong>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>

    )
}

export default AssetCard
