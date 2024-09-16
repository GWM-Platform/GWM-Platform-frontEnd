import React from 'react'

import { Page, Text, View, Image } from '@react-pdf/renderer'
//import SF from 'Fonts/SF-Regular.ttf'
import { useTranslation } from 'react-i18next'
// import { DataTableCell, TableBody, TableCell, TableHeader, Table } from '@david.kucsai/react-pdf-table'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration'
import Decimal from 'decimal.js'

export const Cover = ({ AccountSelected, holdings, year, headerInfo }) => {
    console.log(holdings)
    const { t } = useTranslation();
    const styles = {
        table: {
            display: "table", width: "auto",
            //  borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0
        },
        tableRow: {
            margin: "auto", flexDirection: "row"
        },
        fundsTable: {
            col: {
                width: "16.66%",
                borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
            }
        },
        tableColDate: {
            // width: "12%",
            borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColWidthLeft: {
            width: "50%",
            borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColWidthLeftFirstThirds: {
            width: "40%",
            borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColWidthLeftElseThirds: {
            width: "30%",
            borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColAmount: {
            // width: `${greaterAmount.length + 2}%`,
            borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColBalance: {
            // width: `${greaterBalance.length + 2}%`,
            borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableCell: {
            margin: 3, fontSize: 10, fontFamily: 'SF', fontWeight: 'light'
        },
        tableHeader: {
            margin: 3, fontSize: 10, fontFamily: 'SF', fontWeight: 'bold'
        },
        textRed: {
            color: "rgb(255, 0, 0)"
        },
        textGreen: {
            color: "rgb(71, 116, 79)"
        },
        pageBackground: {
            position: 'absolute',

            // INITIAL
            // minWidth: '100%',
            // minHeight: '100%',
            // display: 'block',
            // height: '100%',
            // width: '100%',

            // W100
            // minWidth: '100%',
            // width: '100%'

            // H100
            // height: '100%',
            // minHeight: '100%',
            // width: "190%",
            // maxWidth: "190%"

            // WITHOUT IMAGE
            display: 'none',
        },
        container: {
            display: 'block',
            height: '100%',
            width: '100%',
            backgroundColor: 'transparent',
            padding: '25px 25px 25px 25px'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            height: '40px',
            width: '100%',
            // backgroundColor: '#082044',
            borderBottomWidth: '1px',
            // borderBottomColor: 'rgb(8, 32, 68)',
            borderBottomColor: "rgb(120, 120, 120)",
            borderBottomStyle: 'solid',
            // padding: '20px',
            // marginBottom: '3px',
            image: {
                height: '35px',
                width: '35px',
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '5px',
                marginRight: '5px'
            },
            textContainer: {
                text: {
                    fontSize: "16px",
                    fontFamily: 'SF',
                },
                textBold: {
                    fontSize: "16px",
                    fontFamily: 'SF',
                    fontWeight: 'bold',
                },
                smaller: {
                    fontSize: "12px",
                    fontFamily: 'SF',
                    fontWeight: 'light',
                }
            }
        },
        body: {
            display: 'flex',
            flexDirection: 'row',
            height: 'calc( 100% - 40px )',
            width: '100%',
            padding: "20px",
            paddingTop: "0",
            backgroundColor: 'rgba(245,245,245)',
        }
    }

    const Divider = () => {
        return (<View style={styles.tableRow}>
            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                <Text style={{ ...styles.tableHeader, opacity: 0 }} />
                <Text style={{ ...styles.tableHeader, opacity: 0 }} />
            </View>
            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                <Text style={{ ...styles.tableHeader, opacity: 0 }} />
                <Text style={{ ...styles.tableHeader, opacity: 0 }} />
            </View>
        </View>)
    }

    return (
        <Page style={{ display: 'block', height: '100%', width: '100%', backgroundColor: "#FFFFFF" }}>
            <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.header.textContainer}>
                        <Text style={styles.header.textContainer.text}>
                            <Text style={styles.header.textContainer.textBold}>{t("Reporte de tenencias período")} {year - 1}-{year}
                                {/* {moment().set("year", year).endOf("year").format("L")} */}
                            </Text>, {t("Client")} {headerInfo?.clientName}
                        </Text>
                        {/* <Text style={styles.header.textContainer.text}>
                            <Text style={styles.header.textContainer.textBold}>{t("Fund")} {fundStatement.fundName}</Text>
                        </Text> */}
                    </View>
                    <View style={styles.header.textContainer.row}>
                        {/* <Text style={styles.header.textContainer.smaller}>
                            {t("Balance (shares)")}: {formatValue({
                                value: (fundStatement?.shares || 0) + "",
                                decimalScale: "2",
                                groupSeparator,
                                decimalSeparator,
                            })
                            }
                        </Text>
                        <Text style={styles.header.textContainer.smaller}>
                            {t("Share price")}: {formatValue({
                                value: (fundStatement?.sharePrice || 0) + "",
                                decimalScale: "2",
                                groupSeparator,
                                decimalSeparator,
                                prefix: "U$D "
                            })
                            }
                        </Text> */}
                    </View>
                    {/* <View style={styles.header.textContainer.row}>
                        <Text style={styles.header.textContainer.smaller}>
                            {t("Balance (U$D)")}: {formatValue({
                                value: fundStatement?.balance + "",
                                decimalScale: "2",
                                groupSeparator,
                                decimalSeparator,
                            })
                            }
                        </Text>
                    </View> */}
                </View>
                <View>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeftFirstThirds, borderColor: "rgb(120, 120, 120)" }}>
                                <Text style={styles.tableHeader}></Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, width: "43.34%", borderColor: "rgb(120, 120, 120)" }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>{t("Rendimiento")}</Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, width: "16.66%", borderColor: "rgb(120, 120, 120)" }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>{t("Amount")}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Balance total inicial ({moment().set("year", year).startOf("year").format("L")})
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (holdings?.totalInitialBalance || 0) + "",
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <Divider />
                        {/* CUENTA CORRIENTE */}
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Balance de cuenta corriente inicial ({moment().set("year", year).startOf("year").format("L")})
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (holdings?.accountsStatement?.[0]?.initialBalance || 0) + "",
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColWidthLeft}>
                                <Text style={styles.tableCell}>
                                    Total de movimientos entrantes
                                </Text>
                            </View>
                            <View style={styles.tableColWidthLeft}>
                                <Text style={{ ...styles.tableCell, textAlign: "right" }} >
                                    +{
                                        formatValue({
                                            value: (
                                                holdings?.accountsStatement?.[0]?.operations
                                                    ?.filter(operation => (operation.motive === "DEPOSIT" || operation.motive === "TRANSFER_RECEIVE") && operation.applied)
                                                    ?.reduce((accum, item) => accum.add(item.amount || 0), Decimal(0)).toFixed(2) || 0
                                            ),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColWidthLeft}>
                                <Text style={styles.tableCell}>
                                    Total de operaciones salientes
                                </Text>
                            </View>
                            <View style={styles.tableColWidthLeft}>
                                <Text style={{ ...styles.tableCell, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (
                                                holdings?.accountsStatement?.[0]?.operations
                                                    ?.filter(operation => (operation.motive === "WITHDRAWAL" || operation.motive === "TRANSFER_SEND") && operation.applied)
                                                    ?.reduce((accum, item) => accum.add(item.amount || 0), Decimal(0)).toFixed(2) || 0
                                            ),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColWidthLeft}>
                                <Text style={styles.tableCell}>
                                    Movimientos por inversiones
                                </Text>
                            </View>
                            <View style={styles.tableColWidthLeft}>
                                <Text style={{ ...styles.tableCell, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (
                                                holdings?.accountsStatement?.[0]?.operations
                                                    ?.filter(operation =>
                                                        operation.motive !== "WITHDRAWAL"
                                                        && operation.motive !== "DEPOSIT"
                                                        && operation.motive !== "TRANSFER_RECEIVE"
                                                        && operation.motive !== "TRANSFER_SEND"
                                                        && operation.applied
                                                    )
                                                    ?.reduce((accum, item) => accum.add(item.amount || 0), Decimal(0)).toFixed(2) || 0
                                            ),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Balance de cuenta corriente final ({moment().set("year", year).endOf("year").format("L")})
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (holdings?.accountsStatement?.[0]?.balance || 0) + "",
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <Divider />
                        {/* FONDOS */}
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Fondo
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    Balance inicial
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    Compras
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    Ventas
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    Rendimiento
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    Saldo final
                                </Text>
                            </View>
                        </View>
                        {
                            holdings?.fundsStatement?.map(fund =>
                                <View style={styles.tableRow}>
                                    <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                        <Text style={styles.tableHeader}>
                                            {fund.fundName}
                                        </Text>
                                    </View>
                                    <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                        <Text style={{ ...styles.tableCell, textAlign: "right" }}>
                                            {
                                                formatValue({
                                                    value: (fund.initialBalance || 0) + "",
                                                    decimalScale: "2",
                                                    groupSeparator,
                                                    decimalSeparator,
                                                    prefix: "U$D "
                                                })
                                            }
                                        </Text>
                                    </View>
                                    <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                        <Text style={{ ...styles.tableCell, textAlign: "right" }}>
                                            {
                                                formatValue({
                                                    value: fund.operations
                                                        .filter(operation => operation.stateId === 2 && Decimal(operation.shares).gt(0))
                                                        .reduce((
                                                            (accum, item) => accum.add(Decimal(item.shares || 0).times(item.sharePrice || 0))
                                                        ), Decimal(0))
                                                        .toFixed(2),
                                                    decimalScale: "2",
                                                    groupSeparator,
                                                    decimalSeparator,
                                                    prefix: "U$D "
                                                })
                                            }

                                        </Text>
                                    </View>
                                    <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                        <Text style={{ ...styles.tableCell, textAlign: "right" }}>
                                            {
                                                formatValue({
                                                    value: fund.operations
                                                        .filter(operation => operation.stateId === 2 && Decimal(operation.shares).lt(0))
                                                        .reduce((
                                                            (accum, item) => accum.add(Decimal(item.shares || 0).times(item.sharePrice || 0))
                                                        ), Decimal(0))
                                                        .toFixed(2),
                                                    decimalScale: "2",
                                                    groupSeparator,
                                                    decimalSeparator,
                                                    prefix: "U$D "
                                                })
                                            }
                                        </Text>
                                    </View>
                                    <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                        <Text style={{ ...styles.tableCell, textAlign: "right" }}>
                                            {formatValue({
                                                value: (fund.performance || 0) + "",
                                                decimalScale: "2",
                                                groupSeparator,
                                                decimalSeparator,
                                                prefix: "U$D "
                                            })}
                                        </Text>
                                    </View>
                                    <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                        <Text style={{ ...styles.tableCell, textAlign: "right" }}>
                                            {formatValue({
                                                value: (fund.balance || 0) + "",
                                                decimalScale: "2",
                                                groupSeparator,
                                                decimalSeparator,
                                                prefix: "U$D "
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            )
                        }
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Total
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    {
                                        formatValue({
                                            value:
                                                holdings?.fundsStatement
                                                    ?.reduce(((accum, fund) => accum.add(fund.initialBalance || 0)), Decimal(0))
                                                    ?.toFixed(2),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    {
                                        formatValue({
                                            value:
                                                holdings?.fundsStatement
                                                    ?.reduce(((accum, fund) => accum.add(
                                                        fund.operations
                                                            .filter(operation => operation.stateId === 2 && Decimal(operation.shares).gt(0))
                                                            .reduce((
                                                                (accum, item) => accum.add(Decimal(item.shares || 0).times(item.sharePrice || 0))
                                                            ), Decimal(0))
                                                            .toFixed(2)
                                                    )), Decimal(0))
                                                    ?.toFixed(2),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    {
                                        formatValue({
                                            value:
                                                holdings?.fundsStatement
                                                    ?.reduce(((accum, fund) => accum.add(
                                                        fund.operations
                                                            .filter(operation => operation.stateId === 2 && Decimal(operation.shares).lt(0))
                                                            .reduce((
                                                                (accum, item) => accum.add(Decimal(item.shares || 0).times(item.sharePrice || 0))
                                                            ), Decimal(0))
                                                            .toFixed(2)
                                                    )), Decimal(0))
                                                    ?.toFixed(2),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    {
                                        formatValue({
                                            value:
                                                holdings?.fundsStatement
                                                    ?.reduce(((accum, fund) => accum.add(fund.performance || 0)), Decimal(0))
                                                    ?.toFixed(2),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                            <View style={{ ...styles.fundsTable.col, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }}>
                                    {
                                        formatValue({
                                            value:
                                                holdings?.fundsStatement
                                                    ?.reduce(((accum, fund) => accum.add(fund.balance || 0)), Decimal(0))
                                                    ?.toFixed(2),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <Divider />

                        {/* PLAZOS FIJOS */}
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Tenencia en plazos fijos de años anteriores
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeft, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: Decimal(holdings?.fixedDepositsStatement?.previousYearPendingBalance || 0).toFixed(2),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeftFirstThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Inversiones en {year}
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (
                                                holdings?.fixedDepositsStatement?.operations
                                                    ?.reduce((accum, item) => accum.add(item.initialAmount || 0), Decimal(0)).toFixed(2) || 0
                                            ),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeftFirstThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Interés devengado
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (
                                                holdings?.fixedDepositsStatement?.operations
                                                    ?.reduce((accum, item) => accum.add(item.profit || 0), Decimal(0)).toFixed(2) || 0
                                            ),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeftFirstThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Saldo final (En curso al final del {year})
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (
                                                holdings?.fixedDepositsStatement?.operations
                                                    ?.reduce((accum, item) => accum.add(Decimal(item.initialAmount || 0).add(item.profit)), Decimal(0)).toFixed(2) || 0
                                            ),
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>

                        <Divider />

                        <View style={styles.tableRow}>
                            <View style={{ ...styles.tableColWidthLeftFirstThirds, /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={styles.tableHeader}>
                                    Balance total final ({moment().set("year", year).endOf("year").format("L")})
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, width: "43.34%" /*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (holdings?.totalPerformance || 0) + "",
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                            <View style={{ ...styles.tableColWidthLeftElseThirds, width: "16.66%"/*borderColor: "rgb(120, 120, 120)"*/ }}>
                                <Text style={{ ...styles.tableHeader, textAlign: "right" }} >
                                    {
                                        formatValue({
                                            value: (holdings?.totalBalance || 0) + "",
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Page>
    )
}