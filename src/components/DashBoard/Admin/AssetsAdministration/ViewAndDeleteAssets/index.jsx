import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import AssetsTable from './AssetsTable'
import AssetsSearch from './AssetsSearch'
import NoAssets from './NoAssets'
import { useTranslation } from 'react-i18next';

const ViewDeleteAndCreateAssets = ({ SearchText, handleSearch, cancelSearch, AssetTypes, FilteredAssets, chargeAssets, setAction, Action }) => {
    const { t } = useTranslation()
    return (
        <Col sm="12" className="ViewDeleteAndCreateAssets">
            <div className="header-with-border">
                <h1 className="title">{t("Assets")}</h1>
            </div>
            <AssetsSearch FilteredAssets={FilteredAssets} SearchText={SearchText} handleSearch={handleSearch} cancelSearch={cancelSearch} />
            {
                FilteredAssets.length === 0 && SearchText.length > 0 ?
                    <NoAssets /> :
                    <AssetsTable Assets={FilteredAssets} AssetTypes={AssetTypes} chargeAssets={chargeAssets} Action={Action} setAction={setAction} />
            }
        </Col>
    )
}

export default ViewDeleteAndCreateAssets