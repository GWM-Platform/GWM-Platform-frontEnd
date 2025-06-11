import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
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

    const fundHistory = useMemo(() => {
        const filtered = fundHistoryRedux.filter(fundHistoryEntry => {
            return firstTransaction ? moment(fundHistoryEntry?.priceDate).isAfter(firstTransaction.createdAt) : true
        })
        return [
            ...firstTransaction ? [{
                fundId: fund?.id,
                id: 0,
                firstTransaction: true,
                priceDate: firstTransaction.createdAt || moment().format(),
                sharePrice: firstTransaction.sharePrice || 0
            }] : [],
            ...filtered,
            ...fund ? [{
                fundId: fund?.id,
                id: 999,
                priceDate: moment().format(),
                sharePrice: fund.sharePrice || 0,
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


    const max = useMemo(() => (
        fundHistory.reduce(
            (prev, current) =>
                (prev.sharePrice > current.sharePrice) ? prev : current, { sharePrice: -Infinity, priceDate: moment().format() }
        )
    ), [fundHistory])

    const min = useMemo(() => (
        fundHistory.reduce(
            (prev, current) =>
                (prev.sharePrice < current.sharePrice) ? prev : current, { sharePrice: +Infinity, priceDate: moment().format() }
        )
    ), [fundHistory])

    const adjustDataRange = useMemo(() => {
        // Calcular la diferencia y el orden de magnitud de la diferencia
        const difference = max.sharePrice - min.sharePrice;
        const orderOfMagnitude = Math.floor(Math.log10(difference));

        // Determinar los factores de ajuste basados en el orden de magnitud
        let adjustmentFactor;
        if (orderOfMagnitude >= 3) {
            adjustmentFactor = Math.pow(10, orderOfMagnitude - 2);
        } else if (orderOfMagnitude === 2) {
            adjustmentFactor = 10;
        } else if (orderOfMagnitude === 1) {
            adjustmentFactor = 1;
        } else {
            adjustmentFactor = 0.1;
        }

        // Ajustar dataMin y dataMax
        const adjustedDataMin = Math.floor((min.sharePrice - difference * 0.05) / adjustmentFactor) * adjustmentFactor;
        const adjustedDataMax = Math.ceil((max.sharePrice + difference * 0.05) / adjustmentFactor) * adjustmentFactor;

        // Asegurar que adjustedDataMin sea mayor que 0
        const finalDataMin = Math.max(1, adjustedDataMin);
        const finalDataMax = adjustedDataMax;

        return { finalDataMin, finalDataMax };
    }, [max.sharePrice, min.sharePrice])

    // ApexCharts options
    const chartOptions = {
        chart: {
            height: '100%',
            type: 'line',
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            // events: {
            //     zoomed: function(chartContext, { xaxis }) {
            //         handleZoomChange({ xaxis });
            //     }
            // },
            animations: {
                enabled: false
            }
        },
        colors: ['#082044'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        markers: {
            size: 6,
            colors: ['#082044'],
            strokeWidth: 2,
            strokeColors: '#fff',
            hover: {
                size: 8
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val) {
                    return dateFormatter(val);
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                enabled: false,
            }
        },
        yaxis: {
            min: adjustDataRange.finalDataMin,
            max: adjustDataRange.finalDataMax,
            title: {
                text: ''
            },
            labels: {
                formatter: function (val) {
                    return numberFormatter(val);
                }
            }
        },
        annotations: {
            yaxis: [
                {
                    y: max.sharePrice,
                    borderColor: 'green',
                    strokeDashArray: 6,
                    label: {
                        text: t("Maximum"),
                        position: 'left',
                        offsetX: 10,
                        style: {
                            color: '#fff',
                            background: 'green',
                        }
                    }
                }
            ],
            xaxis: fundHistory?.[0]?.firstTransaction ? [
                {
                    x: fundHistory[0].datePriceParsed,
                    borderColor: 'green',
                    strokeDashArray: 6
                }
            ] : []
        }
    };

    // Prepare series data for ApexCharts
    const series = [{
        name: t("Share price"),
        data: fundHistory.map(item => ({
            x: item.datePriceParsed,
            y: item.sharePrice,
            currentQuote: item.currentQuote,
            firstTransaction: item.firstTransaction
        }))
    }];

    return (
        <>
            <div style={{ height: '97%', width: '100%', position: 'relative' }}>
                <ReactApexChart
                    options={chartOptions}
                    series={series}
                    type="line"
                    height="100%"
                    width="100%"
                />
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
                                width: "100%"
                            }}
                        />
                        :
                        fundHistory.length === 0 &&
                        <EmptyTable style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            backdropFilter: "blur(2px)",
                            height: "100%",
                            width: "100%"
                        }} />
                }
            </div>
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