import React, { useMemo, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import moment from 'moment';
import './index.scss'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { Badge, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const FixedDepositsGraphic = ({ data }) => {
    const [selectedMonth, setSelectedMonth] = useState(null)

    const { t } = useTranslation()

    const { i18n } = useTranslation();

    moment.locale("EN")
    const formattedData = useMemo(() => data?.map(
        item => ({ month: moment(`${item.name} ${item.year}`, 'MMMM YYYY'), debt: item.debt, monthDeposits: item.monthDeposits })
    )?.map(
        (item, index) => {
            const month = item.month.locale(i18n.language).format('MMMM, yy')
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            return (
                { index: index, month: capitalizedMonth, debt: item.debt, monthDeposits: item.monthDeposits }
            )
        }
    ), [data, i18n.language])

    moment.locale(i18n.language)

    const selectedDetail = useMemo(() => (selectedMonth === null ? { monthDeposits: formattedData.map(month => month.monthDeposits).flat() } : formattedData?.[selectedMonth]), [formattedData, selectedMonth])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">
                        {label}
                        &nbsp;<Badge bg="mainColor">{payload[0]?.payload?.monthDeposits?.length}</Badge>
                    </p>
                    <FormattedNumber value={payload[0].value} prefix="U$D " fixedDecimals={2} />
                </div>
            );
        }

        return null;
    };
    const ref = useRef(null)
    return (
        <div className='transaction-table box-shadow mb-2'>
            <h1 className="m-0 title pe-2">{t("Maturity profile")}</h1>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={formattedData} margin={{ top: 15, right: 20, bottom: 10, left: 20 }}
                    onClick={
                        props => {
                            if (selectedMonth === props?.activeTooltipIndex) {
                                setSelectedMonth(null);
                            } else if (props?.activePayload?.[0]?.payload?.monthDeposits?.length > 0) {
                                setSelectedMonth(props?.activeTooltipIndex);
                                setTimeout(() => { ref?.current?.scrollIntoView({ block: "start", behavior: "smooth" }) }, 150);
                            }
                        }
                    }
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        position={{ x: 0, y: 0 }} // this was my preferred static position
                        wrapperStyle={{ right: 30, top: 30, left: "unset" }}
                        content={CustomTooltip}
                    />
                    <Bar style={{ cursor: "pointer" }} barSize={20} dataKey="debt" fill="#082044" radius={[5, 5, 0, 0]} >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={selectedMonth === index ? "#385074" : "#082044"} />
                        ))}
                    </Bar>

                </BarChart>
            </ResponsiveContainer>
            {
                selectedDetail?.monthDeposits?.length > 0 &&
                <div ref={ref}>

                    <div style={{ borderBottom: "1px solid lightgrey" }} className='mb-2' />
                    <h2 className='mb-3 d-flex align-items-center'>
                        <span>{selectedDetail?.month || "General"}</span>
                        &nbsp;<Badge bg="mainColor">{selectedDetail?.monthDeposits?.length}</Badge>
                    </h2>
                    <Row className='align-items-stretch g-2'>
                        {
                            selectedDetail?.monthDeposits?.map((monthDeposit, key) =>
                                <Col key={key} sm="10" md="4" lg="4" xl="3">
                                    <div className="fixed-deposit-item">
                                        <h3>
                                            {t("Fixed deposit")} #{monthDeposit.id}
                                        </h3>
                                        <h4>
                                            <Link to={`/DashBoard/clientsSupervision/${monthDeposit.clientId}`}>
                                                {
                                                    monthDeposit.client
                                                }
                                            </Link>
                                        </h4>
                                        <h4>
                                            <FormattedNumber value={monthDeposit.profit} prefix="U$D " fixedDecimals={2} />
                                        </h4>
                                        <h4>
                                            {t("Closes on")} {moment(monthDeposit.endDate).format('L')}
                                        </h4>
                                    </div>
                                </Col>
                            )
                        }
                    </Row>
                </div>

            }
        </div>
    )
}

export default FixedDepositsGraphic