import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import AddAsset from './LaunchAddAsset';
import ModalAddAsset from './ModalAddAsset'
import AssetCard from './Asset'
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const FundAssets = ({ Fund }) => {
    const { token } = useContext(DashBoardContext)

    const [Show, setShow] = useState(false);
    const [Assets, setAssets] = useState([]);

    const handleLaunchAddAssetModal = () => {
        setShow(true)
    }

    useEffect(() => {
        const getAssets = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds/${Fund.id}}/sources`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setAssets(data)
            } else {
                switch (response.status) {
                    default:
                        console.error(response.status)
                }
            }
        }
        getAssets()
    }, [Fund])

    return (
        <>
            <Container fluid className="mx-0 mb-3 px-0">
                <Row className="d-flex align-items-stretch mx-0 w-100">
                    <AddAsset launch={handleLaunchAddAssetModal} />
                    {Assets.map((Asset, key) => {
                        return <AssetCard Asset={Asset} key={key} />
                    })}
                </Row>
            </Container>
            <ModalAddAsset Show={Show} setShow={setShow} Fund={Fund} />
        </>
    )
}

export default FundAssets