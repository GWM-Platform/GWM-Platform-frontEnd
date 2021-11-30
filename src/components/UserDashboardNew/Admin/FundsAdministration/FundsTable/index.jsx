import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap'
import FundRow from './FundRow'

const FundsTable = ({Funds}) => {

    const { t } = useTranslation();

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>{t("#id")}</th>
                    <th>{t("Name")}</th>
                    <th>{t("Shares")}</th>
                    <th>{t("Free Shares")}</th>
                    <th>{t("Share Price")}</th>
                    <th>{t("Actions")}</th>
                </tr>
            </thead>
            <tbody>
                {Funds.map((Fund,key)=>{
                    return <FundRow Fund={Fund} key={key}/>
                })}
            </tbody>
        </Table>
    )
}
export default FundsTable