import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap'
import AssetRow from './AssetRow'
import AddAssetRow from './AddAssetRow'

const AssetsTable = ({ Assets, AssetTypes, chargeAssets, setAction, Action }) => {

    const { t } = useTranslation();

    return (
        <div style={{ overflowX: "auto" }}>
            <Table className="AssetsTable" striped bordered hover>

                <thead className="verticalTop tableHeader solid-bg">
                    <tr>
                        <th className="id">{t("#id")}</th>
                        <th className="Name">{t("Name")}</th>
                        <th className="Type">{t("Type")}</th>
                        <th className="SharePrice">{t("Symbol")}</th>
                        <th className="SharePrice">{t("Value")}</th>
                        <th className="Actions">{t("Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {Assets.map((Asset, key) => {
                        return <AssetRow AssetTypes={AssetTypes} Asset={Asset} key={key} ownKey={key}
                            chargeAssets={chargeAssets} Action={Action} setAction={setAction} />
                    })}
                </tbody>
                <thead className="verticalTop">
                    <AddAssetRow Action={Action} setAction={setAction} />
                </thead>
            </Table>
        </div>

    )
}
export default AssetsTable