import React, { useEffect, useMemo, useRef } from 'react'
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
import ApexCharts from 'apexcharts'

const Chart = ({ fund, margin = { top: 5, right: 90, bottom: 5, left: 20 } }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const chartRef = useRef(null)
    const chartId = "fund-chart"
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
    }, [max.sharePrice, min.sharePrice])    // Define the default view - display only the last few entries (like the Vue example)
    const defaultViewCount = 5

    // Calculate the min/max index for default zoom view (last 5 items or all if less than 5)
    const defaultMinIndex = Math.max(0, fundHistory.length - defaultViewCount)
    const defaultMaxIndex = fundHistory.length

    // ApexCharts options    // Function to calculate Y-axis min/max based on visible data points
    const calculateYAxisRange = (minX, maxX) => {
        // Filter data points based on visible X range
        const visiblePoints = fundHistory.filter(point =>
            point.datePriceParsed >= minX && point.datePriceParsed <= maxX
        );

        // If no points in range, return default range
        if (visiblePoints.length === 0) {
            return {
                min: adjustDataRange.finalDataMin,
                max: adjustDataRange.finalDataMax
            };
        }

        // Find min/max share prices in the visible range
        const visibleMax = visiblePoints.reduce(
            (prev, current) => (prev.sharePrice > current.sharePrice) ? prev : current,
            { sharePrice: -Infinity }
        ).sharePrice;

        const visibleMin = visiblePoints.reduce(
            (prev, current) => (prev.sharePrice < current.sharePrice) ? prev : current,
            { sharePrice: +Infinity }
        ).sharePrice;

        // Apply the same adjustment logic as in adjustDataRange
        const difference = visibleMax - visibleMin;
        const orderOfMagnitude = Math.floor(Math.log10(difference));

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

        const adjustedDataMin = Math.floor((visibleMin - difference * 0.05) / adjustmentFactor) * adjustmentFactor;
        const adjustedDataMax = Math.ceil((visibleMax + difference * 0.05) / adjustmentFactor) * adjustmentFactor;

        const finalDataMin = Math.max(1, adjustedDataMin);
        const finalDataMax = adjustedDataMax;

        return {
            min: finalDataMin,
            max: finalDataMax
        };
    };

    const chartOptions = {
        chart: {
            id: chartId,
            height: '100%',
            type: 'line',
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: false // We'll handle Y-axis scaling manually
            },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: false,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                },
                autoSelected: 'pan'
            },
            events: {
                beforeResetZoom: function (chartContext, opts) {
                    // When reset zoom is clicked, show only the last few entries
                    // Similar to Vue example's beforeResetZoom handler
                    if (fundHistory.length <= defaultViewCount) {
                        return {
                            xaxis: {
                                min: fundHistory[0]?.datePriceParsed,
                                max: fundHistory[fundHistory.length - 1]?.datePriceParsed
                            },
                            yaxis: {
                                min: adjustDataRange.finalDataMin,
                                max: adjustDataRange.finalDataMax
                            }
                        }
                    }

                    return {
                        xaxis: {
                            min: fundHistory[defaultMinIndex]?.datePriceParsed,
                            max: fundHistory[defaultMaxIndex - 1]?.datePriceParsed
                        },
                        yaxis: {
                            min: adjustDataRange.finalDataMin,
                            max: adjustDataRange.finalDataMax
                        }
                    }
                },
                beforeZoom: function (chartContext, { xaxis }) {
                    // Limit zoom to available data points
                    // Similar to Vue example's beforeZoom handler
                    const minDate = fundHistory[0]?.datePriceParsed
                    const maxDate = fundHistory[fundHistory.length - 1]?.datePriceParsed

                    const newMinX = xaxis.min < minDate ? minDate : xaxis.min;
                    const newMaxX = xaxis.max > maxDate ? maxDate : xaxis.max;

                    // Calculate Y-axis range based on visible points
                    const yAxisRange = calculateYAxisRange(newMinX, newMaxX);

                    return {
                        xaxis: {
                            min: newMinX,
                            max: newMaxX
                        },
                        yaxis: {
                            min: yAxisRange.min,
                            max: yAxisRange.max
                        }
                    }
                },
                zoomed: function (chartContext, { xaxis }) {
                    // After zoom is applied, re-calculate and update Y-axis
                    if (xaxis && xaxis.min && xaxis.max) {
                        const yAxisRange = calculateYAxisRange(xaxis.min, xaxis.max);

                        chartContext.updateOptions({
                            yaxis: {
                                min: yAxisRange.min,
                                max: yAxisRange.max
                            }
                        }, false, false);
                    }
                },
                scrolled: function (chartContext, { xaxis }) {
                    // After pan is applied, re-calculate and update Y-axis
                    if (xaxis && xaxis.min && xaxis.max) {
                        const yAxisRange = calculateYAxisRange(xaxis.min, xaxis.max);
                        chartContext.updateOptions({
                            yaxis: {
                                min: yAxisRange.min,
                                max: yAxisRange.max
                            }
                        }, false, false);
                    }
                }
            },
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
        }, xaxis: {
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
            },
            // Set initial view to show only the last few entries (if there are enough entries)
            min: fundHistory.length > defaultViewCount ?
                fundHistory[defaultMinIndex]?.datePriceParsed :
                fundHistory[0]?.datePriceParsed,
            max: fundHistory.length ?
                fundHistory[fundHistory.length - 1]?.datePriceParsed :
                undefined
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
    };    // Prepare series data for ApexCharts
    const series = [{
        name: t("Share price"),
        data: fundHistory.map(item => ({
            x: item.datePriceParsed,
            y: item.sharePrice,
            currentQuote: item.currentQuote,
            firstTransaction: item.firstTransaction
        }))
    }];
    // Function to reset chart values (similar to resetValues in the Vue example)
    const resetChartValues = () => {
        ApexCharts.exec(
            chartId,
            'updateOptions',
            {
                xaxis: {
                    min: fundHistory[defaultMinIndex]?.datePriceParsed,
                    max: fundHistory[defaultMaxIndex - 1]?.datePriceParsed
                },
                // Reset Y-axis to original scale for the entire dataset
                yaxis:
                    calculateYAxisRange(fundHistory[defaultMinIndex]?.datePriceParsed, fundHistory[defaultMaxIndex - 1]?.datePriceParsed)
                //     min: adjustDataRange.finalDataMin,
                //     max: adjustDataRange.finalDataMax
                // }
            },
            false,
            true
        );
    };

    useEffect(() => {
        if (!(fundHistoryStatus === 'loading' || transactionStatus === "loading")) {
            resetChartValues();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fundHistoryStatus, transactionStatus])

    return (
        <>            <div style={{ height: '90%', width: '100%', position: 'relative' }}>
            <ReactApexChart
                ref={chartRef}
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