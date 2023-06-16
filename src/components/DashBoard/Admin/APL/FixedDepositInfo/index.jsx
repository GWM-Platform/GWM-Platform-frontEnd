import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
//eslint-disable-next-line
import { Col, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Decimal from 'decimal.js';
const FixedDepositInfo = ({fullSettlement}) => {

    const { t } = useTranslation()

    const fixedDepositAtClose = () => {
        return (fullSettlement?.debt?.fixedDeposits?.graphicData?.reduce((acumulator, monthlyData) => Decimal(acumulator).plus(monthlyData.debt).toNumber(), 0))
    }

    return (
        <div className="fundInfo bg-white info ms-0">
            <div className="d-flex justify-content-between align-items-end">
                <h1 className="m-0 title pe-2">
                    {t("Fixed deposits")}
                </h1>
            </div>
            <div>
                <h2 className="mt-2 pe-2 topic">
                    {t("Fixed deposit debt as of today")}
                    <br />
                    <span style={{ fontWeight: "bolder" }}>
                        <FormattedNumber prefix="U$S " value={fullSettlement?.debt?.fixedDeposits?.todaysDebt} fixedDecimals={2} />
                    </span>
                </h2>
            </div>
            <div>
                <h2 className="mt-2 pe-2 topic">
                    {t("Fixed deposit debt at closing")}
                    <br />
                    <span style={{ fontWeight: "bolder" }}>
                        <FormattedNumber prefix="U$S "value={fixedDepositAtClose()} fixedDecimals={2} />
                    </span>
                </h2>
            </div>
        </div>
    )
}
export default FixedDepositInfo

