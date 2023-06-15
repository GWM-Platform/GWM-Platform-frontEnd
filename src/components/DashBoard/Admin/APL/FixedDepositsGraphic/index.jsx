import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import './index.scss'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const FixedDepositsGraphic = ({ data }) => {

    const { t } = useTranslation()

    const { i18n } = useTranslation();
    const formattedData =
        data?.map(
            item => ({ month: moment(`${item.name} ${item.year}`, 'MMMM YYYY').locale("EN"), debt: item.debt })
        )?.map(
            item => {
                const month= item.month.locale(i18n.language).format('MMMM yy')
                const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

                return (
                    { month: capitalizedMonth, debt: item.debt }
                )
            }
        )

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {

            return (
                <div className="custom-tooltip">
                    <p className="label">{label}</p>
                    <FormattedNumber value={payload[0].value} prefix="U$D " fixedDecimals={2} />
                </div>
            );
        }

        return null;
    };
    return (
        <div className='transaction-table box-shadow mb-2'>
            <h1 className="m-0 title pe-2">{t("Monthly debt")}</h1>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        content={CustomTooltip}
                    />
                    <Bar dataKey="debt" fill="#082044" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FixedDepositsGraphic