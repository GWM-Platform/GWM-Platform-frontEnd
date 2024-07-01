import React, { useEffect, useMemo } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Label, Brush } from 'recharts';
import './index.css'
import moment from 'moment';
import { fetchFundHistory, selectFundHistoryByFundId } from 'Slices/DashboardUtilities/fundHistorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { formatValue } from '@osdiab/react-currency-input-field';
import { useTranslation } from 'react-i18next';
import { selectAllTransactions } from 'Slices/DashboardUtilities/transactionsSlice';
import EmptyTable from 'components/DashBoard/GeneralUse/EmptyTable';
import Loading from 'components/DashBoard/GeneralUse/Loading';

const Chart = ({ fund, margin = { top: 5, right: 90, bottom: 5, left: 20 } }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const transactionStatus = useSelector(state => state.transactions.status)
    const firstTransaction = useSelector(selectAllTransactions)?.transactions?.[0]
    const fundHistoryRedux = useSelector(state => selectFundHistoryByFundId(state, fund?.id)).sort((a, b) => moment(a?.priceDate).diff(moment(b?.priceDate)))
    // Filter to only show history after the first transaction
    const fundHistory = useMemo(() => {

        const filtered = fundHistoryRedux.filter(fundHistoryEntry => {
            return firstTransaction ? moment(fundHistoryEntry?.priceDate).isAfter(firstTransaction.createdAt) : true
        })
        return [
            ...firstTransaction ? [{
                fundId: fund?.id,
                id: 0,
                firstTransaction: true,
                priceDate: firstTransaction.createdAt,
                sharePrice: firstTransaction.sharePrice
            }] : [],
            ...filtered,
            ...fund ? [{
                fundId: fund?.id,
                id: 999,
                priceDate: moment().format(),
                sharePrice: fund.sharePrice,
                currentQuote: true
            }] : []
        ].map(a => ({ ...a, datePriceParsed: Date.parse(a?.priceDate) }))
    }, [firstTransaction, fund, fundHistoryRedux])

    const fundHistoryStatus = useSelector(state => state.fundHistory.status)
    useEffect(() => {
        if (fundHistoryStatus === 'idle') {
            dispatch(fetchFundHistory())
        }
    }, [dispatch, fundHistoryStatus])

    const max = fundHistory.reduce((prev, current) => (prev.sharePrice > current.sharePrice) ? prev : current, {})

    return (
        <>

            <ResponsiveContainer width="100%" height="97%">
                <LineChart data={fundHistory} margin={margin}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis angle={0} dx={20} scale="time" type='number' domain={[fundHistory[0]?.priceDate, fundHistory[fundHistory.length - 1]?.priceDate]} dataKey="datePriceParsed" tickFormatter={dateFormatter} />
                    <YAxis tickFormatter={(value) => numberFormatter(value)} padding={{ top: 30 }} />
                    <Tooltip
                        content={(props) => (<TooltipRubros {...props} />)}
                        label={"Share price"}
                        formatter={(value) => numberFormatter(value, 2, "U$D ")}
                        labelFormatter={dateFormatter} />
                    <ReferenceLine ifOverflow='extendDomain' strokeDasharray="6 6" y={max.sharePrice} stroke="green"  >
                        <Label value={t("Maximum")} position="top" />
                    </ReferenceLine>
                    <Line isAnimationActive={false} type="monotone" dataKey="sharePrice" stroke="#082044" strokeWidth={2}
                        // dot={{ stroke: '#082044', strokeWidth: 2 }}
                        dot={(props) => <CustomizedDot {...props} nextPoint={props.payload.firstTransaction ? fundHistory[fundHistory.findIndex(item => item.id === props.payload.id) + 1] : false} />}

                    />
                    {
                        fundHistory?.[0]?.firstTransaction &&
                        <ReferenceLine x={fundHistory?.[0]?.datePriceParsed} stroke="green" strokeDasharray="6 6" >
                            {/* <Label style={{ fill: "#000000", dy: -10 }} position="insideLeft" /> */}
                        </ReferenceLine>
                    }
                    <Brush
                        dataKey="datePriceParsed" height={30} stroke="#8884d8" tickFormatter={dateFormatter}
                        startIndex={fundHistory.findIndex(history => moment(history.datePriceParsed).year() === moment().year())} endIndex={fundHistory.length - 1}
                    />
                </LineChart>
            </ResponsiveContainer>
            {
                fundHistoryStatus === 'loading' || transactionStatus === "loading" ?
                    <Loading
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            backdropFilter: "blur(2px)",
                            height: "100%",
                            minHeight: "unset",
                        }}
                    />
                    :
                    fundHistory.length === 0 &&
                    <EmptyTable style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        backdropFilter: "blur(2px)",
                        height: "100%"
                    }} />
            }

        </>
    )
}
export default Chart

const numberFormatter = (value, decimalScale = 2, prefix = "") => {
    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
    const thousandsSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','
    return formatValue({
        value: value + "",
        groupSeparator: thousandsSeparator,
        decimalSeparator,
        prefix,
        decimalScale: decimalScale,
    });
};

const dateFormatter = (value) => {
    const str = moment(value).format("MMMM YYYY");
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    return str2;
};

const TooltipRubros = ({ label, payload, focusBar }) => {
    const { t } = useTranslation()

    if (payload && payload.length) {
        return (
            <div
                className="recharts-default-tooltip"
                style={{
                    margin: "0px",
                    padding: "10px",
                    backgroundColor: "rgb(255, 255, 255)",
                    border: "1px solid rgb(204, 204, 204)",
                    whiteSpace: "nowrap",
                }}
            >
                <p className="recharts-tooltip-label" style={{ margin: 0 }}>
                    <span>{dateFormatter(label)}{payload?.[0]?.payload?.currentQuote ? t(" (Current)") : ""}</span>
                    <br />
                    <span>{t("Price")}: {numberFormatter(payload?.[0]?.payload?.sharePrice, 2, "U$D ")}</span>
                </p>
            </div>
        );
    }
    return null;
};

const CustomizedDot = (props) => {
    const { t } = useTranslation()

    const { cx, cy, nextPoint, payload } = props;
    // Determina la posición del label basado en la posición del próximo punto
    const labelYOffset = nextPoint?.sharePrice && payload?.sharePrice > nextPoint?.sharePrice ? -5 : 20; // Mueve el label arriba o abajo basado en la posición del próximo punto
    const labelXOffset = 5; // Mueve el label a la derecha del punto

    return (
        <g>
            <circle cx={cx} cy={cy} r="4" fill="#082044" strokeWidth="2" stroke="#fff" />
            {
                nextPoint &&
                <text x={cx + labelXOffset} y={cy + labelYOffset} fill="#082044" textAnchor="start">
                    {t("First operation")}
                </text>
            }
        </g>
    );
};