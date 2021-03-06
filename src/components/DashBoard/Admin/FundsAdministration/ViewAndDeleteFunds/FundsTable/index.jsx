import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap'
import FundRow from './FundRow'
import AddFundRow from './AddFundRow'

const FundsTable = ({ Funds, AssetTypes, chargeFunds, setAction, Action }) => {

    const { t } = useTranslation();

    return (
        <div style={{overflowX:"auto",scrollSnapType:"both mandatory"}}>
            <Table className="FundsTable" striped bordered hover>
                <thead className="verticalTop tableHeader solid-bg">
                    <tr>
                        <th className="Name">{t("Name")}</th>
                        <th className="Type">{t("Type")}</th>
                        <th className="Shares">{t("Total shares")}</th>
                        <th className="FreeShares">{t("APL shares")}</th>
                        <th className="SharePrice">{t("Share price")}</th>
                        <th className="id">{t("Id")}</th>
                        <th className="Actions">{t("Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {Funds.map((Fund, key) => {
                        return <FundRow AssetTypes={AssetTypes} Fund={Fund} key={key} ownKey={key}
                            chargeFunds={chargeFunds} Action={Action} setAction={setAction} />
                    })}
                </tbody>
                <thead className="verticalTop">
                    <AddFundRow Action={Action} setAction={setAction} />
                </thead>
            </Table>
        </div>

    )
}
export default FundsTable