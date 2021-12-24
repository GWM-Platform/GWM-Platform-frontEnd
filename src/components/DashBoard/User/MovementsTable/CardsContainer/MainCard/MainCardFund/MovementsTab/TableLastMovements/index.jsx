import React,{useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ page, setPage, movsShown, movementsCount, content, decimals, symbol,NavInfoToggled,Fund,setPerformance }) => {
    const { t } = useTranslation();

    useEffect(() => {
        let actualMoney= Fund.shares * Fund.fund.sharePrice
        let moneySpent=0
        content.forEach((a)=>{
            moneySpent+=a.shares*a.sharePrice
        })
        setPerformance(actualMoney*100/moneySpent-100)
    }, [Fund,content,setPerformance])

    return (
        <div className={NavInfoToggled? "movementsTable-navInfoToggled growAnimation" : "movementsTable growAnimation" }>
            <Table id="tableMovements" striped bordered hover className="mb-auto m-0" >
                <thead >
                    <tr>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("in FeePars")}</th>
                        <th className="tableAmount">{t("In Cash")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Value of the share (at the time of the operation)")}</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((u, i) => { ; return (<Movement key={i} content={u} symbol={symbol} decimals={decimals} />) })}
                </tbody>
            </Table>
        </div>
    )
}
export default TableLastMovements
