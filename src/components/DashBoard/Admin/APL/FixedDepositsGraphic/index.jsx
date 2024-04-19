import React, { useMemo, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import moment from 'moment';
import './index.scss'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { Badge, ButtonGroup, Col, Row, Table, ToggleButton } from 'react-bootstrap';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import Decimal from 'decimal.js';

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
    const [tableView, setTableView] = useState(true)

    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const sortData = (field) => {
        if (sortField === field && sortDirection === 'desc') {
            setSortField(null);
            setSortDirection('asc');
        }
        else {
            let direction = 'asc';
            if (sortField === field && sortDirection === 'asc') {
                direction = 'desc';
            }
            setSortField(field);
            setSortDirection(direction);
        }
    };

    const sortedAccounts = useMemo(() => (
        [...selectedDetail?.monthDeposits || []]
            .sort((a, b) => {
                if (sortField && a[sortField] && b[sortField]) {
                    if (typeof a[sortField] === 'string') {
                        return sortDirection === 'asc' ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
                    } else {
                        return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
                    }
                }
                return 0;
            })
    ), [selectedDetail?.monthDeposits, sortDirection, sortField])

    const total = useMemo(() => [...selectedDetail?.monthDeposits || []].reduce((accum, monthDeposit) => (accum.add(monthDeposit.profit)), Decimal(0)), [selectedDetail?.monthDeposits])

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
                        <ButtonGroup className='ms-auto'>
                            <ToggleButton
                                type="radio"
                                style={{ lineHeight: "1em", display: "flex" }}
                                variant="outline-primary"
                                name="radio"
                                value={true}
                                checked={tableView}
                                active={tableView}
                                onClick={(e) => setTableView(true)}
                                title={t("Table View")}
                            >
                                <img src={`${process.env.PUBLIC_URL}/images/generalUse/table${tableView ? "" : "-active"}.svg`} alt="performance" />
                            </ToggleButton>
                            <ToggleButton
                                style={{ lineHeight: "1em", display: "flex" }}
                                type="radio"
                                variant="outline-primary"
                                name="radio"
                                value={false}
                                checked={!tableView}
                                active={!tableView}
                                onClick={(e) => setTableView(false)}
                                title={t("Grid View")}
                            >
                                <img src={`${process.env.PUBLIC_URL}/images/generalUse/grid${tableView ? "-active" : ""}.svg`} alt="performance" />
                            </ToggleButton>
                        </ButtonGroup>
                    </h2>
                    <Row className='align-items-stretch g-2'>
                        {
                            tableView ?
                                <Table striped bordered hover className="mb-auto m-0 mt-2" >
                                    <thead >
                                        <tr>
                                            <th className="tableHeader" onClick={() => sortData('id')} style={{ cursor: "pointer" }}>
                                                <span className='d-flex'>

                                                    <span>
                                                        {t("Fixed deposit")}
                                                    </span>
                                                    <FontAwesomeIcon className='ms-auto' icon={sortField === "id" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                </span>
                                            </th>
                                            <th className="tableHeader" onClick={() => sortData('client')} style={{ cursor: "pointer" }}>
                                                <span className='d-flex'>
                                                    <span>
                                                        {t("Client")}
                                                    </span>
                                                    <FontAwesomeIcon className="ms-auto" icon={sortField === "client" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                </span>
                                            </th>
                                            <th className="tableHeader" onClick={() => sortData('endDate')} style={{ cursor: "pointer" }}>
                                                <span className='d-flex'>
                                                    <span>
                                                        {t("Closes on")}
                                                    </span>
                                                    <FontAwesomeIcon className="ms-auto" icon={sortField === "endDate" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                </span>
                                            </th>
                                            <th className="tableHeader" onClick={() => sortData('profit')} style={{ cursor: "pointer" }}>
                                                <span className='d-flex'>
                                                    <span>
                                                        {t("Amount")}
                                                    </span>
                                                    <FontAwesomeIcon className="ms-auto" icon={sortField === "profit" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sortedAccounts?.map(monthDeposit => {
                                                return (
                                                    <tr key={monthDeposit.id}>
                                                        <td className="tableDate">#{monthDeposit.id}</td>
                                                        <td className="tableDate">
                                                            <Link to={`/DashBoard/clientsSupervision/${monthDeposit.clientId}`}>{monthDeposit.client}</Link>
                                                        </td>
                                                        <td className="tableDate">{moment(monthDeposit.endDate).format('L')}</td>
                                                        <td className="tableDate"><FormattedNumber value={monthDeposit.profit} prefix="U$D " fixedDecimals={2} /></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        {

                                            <tr >
                                                <td className="tableDate"><strong>Total</strong></td>
                                                <td className="tableDate"></td>
                                                <td className="tableDate"></td>
                                                <td className="tableDate"><strong><FormattedNumber value={total} prefix="U$D " fixedDecimals={2} /></strong></td>
                                            </tr>

                                        }
                                    </tbody>
                                </Table>
                                :
                                sortedAccounts?.map((monthDeposit, key) =>
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