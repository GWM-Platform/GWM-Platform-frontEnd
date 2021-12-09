import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import AssetCard from './AssetCard';

const AvailableAssets = ({Assets,AssetSelected,setAssetSelected}) => {
    

    return (
        <Container fluid className="mx-0 my-3 px-0 ">
            <Row className="d-flex align-items-stretch mx-0 w-100 firstWithouthPadding">
                {Assets.map(
                    (Asset, key) => {
                        return <AssetCard Asset={Asset} key={key} ownKey={key} AssetSelected={AssetSelected} setAssetSelected={setAssetSelected}/>
                    }
                )}
            </Row>
        </Container>
    )
}

export default AvailableAssets