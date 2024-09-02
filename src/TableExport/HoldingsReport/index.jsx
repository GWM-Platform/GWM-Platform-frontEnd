import React from 'react'

import { Document, Page, Text, View, Image, Font } from '@react-pdf/renderer'
//import SF from 'Fonts/SF-Regular.ttf'
import { useTranslation } from 'react-i18next'
import Decimal from 'decimal.js'
// import { DataTableCell, TableBody, TableCell, TableHeader, Table } from '@david.kucsai/react-pdf-table'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration'
import SfLight from '../MovementTable/Fonts/SF/SF-Pro-Text-Light.otf'
import SfMedium from '../MovementTable/Fonts/SF/SF-Pro-Text-Medium.otf'
import SfRegular from '../MovementTable/Fonts/SF/SF-Pro-Text-Regular.otf'
import SfBold from '../MovementTable/Fonts/SF/SF-Pro-Text-Bold.otf'
import SfSemiBold from '../MovementTable/Fonts/SF/SF-Pro-Text-Semibold.otf'

// Registrar la fuente
Font.register({
    family: 'SF',
    fonts: [
        { src: SfBold, fontWeight: 'bold' },
        { src: SfRegular },
        { src: SfMedium, fontWeight: 'medium' },
        { src: SfSemiBold, fontWeight: 'semibold' },
        { src: SfLight, fontWeight: 'light' },
    ]
});

const paginate = (array, pageSize) => {
    return array.reduce((acc, _, i) => {
        if (i % pageSize === 0) acc.push(array.slice(i, i + pageSize));
        return acc;
    }, []);
};


const HoldingsReport = ({ headerInfo, sharesDecimalPlaces = 5, AccountSelected, holdings, year = 2023 }) => {
    Decimal.set({ precision: 100 })
    console.log(year, moment().set("year", year).endOf("year").format("L"))
    const { t } = useTranslation();

    return (
        <Document>
            {
                holdings.accountsStatement.map(
                    (accountStatement, accountStatementIndex) => {
                        const paginatedMovements = paginate(accountStatement.operations, 38);

                        const greaterAmount = accountStatement.operations.reduce((acc, content) => {
                            const value = `${Math.sign(content.amount) === 1 ? '+' : '-'
                                }${formatValue({
                                    value: (Math.abs(content.amount) || 0) + "",
                                    decimalScale: "2",
                                    groupSeparator,
                                    decimalSeparator,
                                    prefix: "U$D "
                                })
                                }`
                            return value.length > acc.length ? value : acc
                        }, "")
                        const greaterBalance = accountStatement.operations.reduce((acc, content) => {
                            const value = `${content.partialBalance ? formatValue({
                                value: (Math.abs(content.partialBalance) || 0) + "",
                                decimalScale: "2",
                                groupSeparator,
                                decimalSeparator,
                                prefix: "U$D "
                            }) : "-"
                                }`
                            return value.length > acc.length ? value : acc
                        }, "")

                        const styles = {
                            table: {
                                display: "table", width: "auto",
                                //  borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0
                            },
                            tableRow: {
                                margin: "auto", flexDirection: "row"
                            },
                            tableColDate: {
                                width: "12%", borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
                            },
                            tableColWidthLeft: {
                                width: `${100 - (greaterAmount.length + 2) - (greaterBalance.length + 2) - 12}%`, borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
                            },
                            tableColAmount: {
                                width: `${greaterAmount.length + 2}%`, borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
                            },
                            tableColBalance: {
                                width: `${greaterBalance.length + 2}%`, borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
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
                                height: '70px',
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
                                height: 'calc( 100% - 70px )',
                                width: '100%',
                                padding: "20px",
                                paddingTop: "0",
                                backgroundColor: 'rgba(245,245,245)',
                            }
                        }
                        return paginatedMovements.map((pageMovements, pageIndex) => (
                            <Page key={pageIndex} style={{ display: 'block', height: '100%', width: '100%', backgroundColor: "#FFFFFF" }}>
                                <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
                                <View style={styles.container}>
                                    <View style={styles.header}>
                                        <View style={styles.header.textContainer}>
                                            <Text style={styles.header.textContainer.text}>
                                                <Text style={styles.header.textContainer.textBold}>{t("Reporte de tenencias al")} {moment().set("year", year).endOf("year").format("L")}</Text>, {t("Client")} {headerInfo?.clientName}
                                            </Text>
                                            <Text style={styles.header.textContainer.text}>
                                                <Text style={styles.header.textContainer.textBold}>{t("Cash")}</Text>
                                            </Text>
                                            <Text style={styles.header.textContainer.smaller}>
                                                {t("Balance")}: {formatValue({
                                                    value: (accountStatement?.balance || 0) + "",
                                                    decimalScale: "2",
                                                    groupSeparator,
                                                    decimalSeparator,
                                                    prefix: "U$D "
                                                })
                                                }
                                            </Text>
                                        </View>
                                        {/* <Image src={`${process.env.PUBLIC_URL}/images/PDF/logo.png`} style={styles.header.image} /> */}
                                    </View>
                                    <View>
                                        <View style={styles.table}>
                                            <View style={styles.tableRow}>
                                                <View style={{ ...styles.tableColDate, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={styles.tableHeader}>{t("Date")}</Text>
                                                </View>
                                                <View style={{ ...styles.tableColWidthLeft, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={styles.tableHeader}>{t("Description")}</Text>
                                                </View>
                                                <View style={{ ...styles.tableColAmount, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={{ ...styles.tableHeader, textAlign: "right" }}>{t("Amount")}</Text>
                                                </View>
                                                <View style={{ ...styles.tableColBalance, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={{ ...styles.tableHeader, textAlign: "right" }}>{t("Balance")}</Text>
                                                </View>
                                            </View>
                                            {
                                                pageMovements.map((content, index) => {
                                                    const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
                                                    const partialLiquidate = content?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")
                                                    const fundLiquidate = content?.notes?.find(note => note.noteType === "FUND_LIQUIDATE")

                                                    return (
                                                        <View style={styles.tableRow} key={index}>
                                                            <View style={styles.tableColDate}>
                                                                <Text style={styles.tableCell}>
                                                                    {
                                                                        moment(content.createdAt).format('L')
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style={styles.tableColWidthLeft}>
                                                                <Text style={styles.tableCell}>
                                                                    {

                                                                        `${(!content?.transferReceiver && !content?.transferSender) ?
                                                                            (
                                                                                fundLiquidate ?
                                                                                    `${t("Fund liquidation")} ${content.fundName}`
                                                                                    :
                                                                                    t(content.motive + (content.motive === "REPAYMENT" ? content.fundName ? "_" + content.fundName : "_" + content.fixedDepositId : ""), { fund: content.fundName, fixedDeposit: content.fixedDepositId })
                                                                            ) : ""
                                                                        }${content?.transferReceiver ? `${t("Transfer to {{transferReceiver}}", { transferReceiver: content?.transferReceiver })}` : ""
                                                                        }${content?.transferSender ? `${t("Transfer from {{transferSender}}", { transferSender: content?.transferSender })}` : ""
                                                                        }${(content?.transfer?.reverted && transferNote?.text === "Transferencia revertida") ? `, ${t("reversion")}` : ""
                                                                        }${!!(partialLiquidate) ? ` (${t("Partial liquidation")})` : ""}`
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style={styles.tableColAmount}>
                                                                <Text style={{ ...styles.tableCell, ...Math.sign(content.amount) === 1 ? styles.textGreen : styles.textRed, textAlign: "right" }} >
                                                                    {
                                                                        `${Math.sign(content.amount) === 1 ? '+' : '-'
                                                                        }${formatValue({
                                                                            value: (Math.abs(content.amount) || 0) + "",
                                                                            decimalScale: "2",
                                                                            groupSeparator,
                                                                            decimalSeparator,
                                                                            prefix: "U$D "
                                                                        })
                                                                        }`
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style={styles.tableColBalance}>
                                                                <Text style={{ ...styles.tableCell, textAlign: "right" }} >
                                                                    {
                                                                        `${content.partialBalance ?
                                                                            formatValue({
                                                                                value: (Math.abs(content.partialBalance) || 0) + "",
                                                                                decimalScale: "2",
                                                                                groupSeparator,
                                                                                decimalSeparator,
                                                                                prefix: "U$D "
                                                                            })
                                                                            :
                                                                            "-"
                                                                        }`
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            </Page>
                        ))
                    }

                )
            }
            {
                holdings.fundsStatement.map(
                    fundStatement => {
                        const fundStatementPaginatedTransactions = paginate(fundStatement.operations, 38);
                        const greaterAmount = fundStatement.operations.reduce((acc, content) => {
                            const decimalSharesAbs = new Decimal(content.shares).abs()
                            const decimalPrice = new Decimal(content.sharePrice)
                            const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

                            const value = `+${formatValue({
                                value: amount.toString(),
                                decimalScale: "2",
                                groupSeparator,
                                decimalSeparator,
                                prefix: "U$D "
                            })}`

                            return value.length > acc.length ? value : acc
                        }, "")
                        const greaterSharePrice = fundStatement.operations.reduce((acc, content) => {
                            const value = `${content.sharePrice ? formatValue({
                                value: (Math.abs(content.sharePrice) || 0) + "",
                                decimalScale: "2",
                                groupSeparator,
                                decimalSeparator,
                                prefix: "U$D "
                            }) : "-"
                                }`
                            return value.length > acc.length ? value : acc
                        }, t("Share Price"))

                        const styles = {
                            table: {
                                display: "table", width: "auto",
                                //  borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0
                            },
                            tableRow: {
                                margin: "auto", flexDirection: "row"
                            },
                            tableColDate: {
                                width: "12%", borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
                            },
                            tableColWidthLeft: {
                                width: `${100 - (greaterAmount.length + 2) - (greaterSharePrice.length + 2) - 12}%`, borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
                            },
                            tableColAmount: {
                                width: `${greaterAmount.length + 2}%`, borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
                            },
                            tableColSharePrice: {
                                width: `${greaterSharePrice.length + 2}%`, borderStyle: "solid", borderColor: "rgb(222, 226, 230)", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
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
                                height: '70px',
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
                                    },
                                    row: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        width: '100%',
                                    }
                                }
                            },
                            body: {
                                display: 'flex',
                                flexDirection: 'row',
                                height: 'calc( 100% - 70px )',
                                width: '100%',
                                padding: "20px",
                                paddingTop: "0",
                                backgroundColor: 'rgba(245,245,245)',
                            }
                        }

                        return fundStatementPaginatedTransactions.map((pageTransactions, pageIndex) => (
                            <Page key={pageIndex} style={{ display: 'block', height: '100%', width: '100%', backgroundColor: "#FFFFFF" }}>
                                <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
                                <View style={styles.container}>
                                    <View style={styles.header}>
                                        <View style={styles.header.textContainer}>
                                            <Text style={styles.header.textContainer.text}>
                                                <Text style={styles.header.textContainer.textBold}>{t("Reporte de tenencias al")} {moment().set("year", year).endOf("year").format("L")}</Text>, {t("Client")} {headerInfo?.clientName}
                                            </Text>
                                            <Text style={styles.header.textContainer.text}>
                                                <Text style={styles.header.textContainer.textBold}>{t("Fund")} {fundStatement.fundName}</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.header.textContainer.row}>
                                            <Text style={styles.header.textContainer.smaller}>
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
                                            </Text>
                                        </View>
                                        <View style={styles.header.textContainer.row}>
                                            <Text style={styles.header.textContainer.smaller}>
                                                {t("Balance (U$D)")}: {formatValue({
                                                    value: fundStatement?.balance + "",
                                                    decimalScale: "2",
                                                    groupSeparator,
                                                    decimalSeparator,
                                                })
                                                }
                                            </Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.table}>
                                            <View style={styles.tableRow}>
                                                <View style={{ ...styles.tableColDate, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={styles.tableHeader}>{t("Date")}</Text>
                                                </View>
                                                <View style={{ ...styles.tableColWidthLeft, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={styles.tableHeader}>{t("Description")}</Text>
                                                </View>
                                                <View style={{ ...styles.tableColSharePrice, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={{ ...styles.tableHeader, textAlign: "right" }}>{t("Share price")}</Text>
                                                </View>
                                                <View style={{ ...styles.tableColAmount, borderColor: "rgb(120, 120, 120)" }}>
                                                    <Text style={{ ...styles.tableHeader, textAlign: "right" }}>{t("Amount")}</Text>
                                                </View>
                                            </View>
                                            {
                                                pageTransactions.map((content, index) => {
                                                    const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
                                                    const isTransfer = content.receiverId || content.senderId
                                                    const incomingTransfer = () => content.receiverId === AccountSelected?.id

                                                    const decimalSharesAbs = new Decimal(content.shares).abs()
                                                    const decimalPrice = new Decimal(content.sharePrice)
                                                    const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

                                                    return (
                                                        <View style={styles.tableRow} key={index}>
                                                            <View style={styles.tableColDate}>
                                                                <Text style={styles.tableCell}>
                                                                    {
                                                                        moment(content.createdAt).format('L')
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style={styles.tableColWidthLeft}>
                                                                <Text style={styles.tableCell}>
                                                                    {
                                                                        isTransfer ?
                                                                            t(
                                                                                incomingTransfer() ?
                                                                                    "Transfer from {{transferSender}}"
                                                                                    :
                                                                                    "Transfer to {{transferReceiver}}",
                                                                                {
                                                                                    transferReceiver: content.receiverAlias,
                                                                                    transferSender: content.senderAlias
                                                                                }
                                                                            )
                                                                            :
                                                                            (Math.sign(content.shares) === 1 ? t('Purchase') : t('Sale'))
                                                                    }
                                                                    ,&nbsp;
                                                                    {formatValue({
                                                                        value: Math.abs(content.shares) + "",
                                                                        decimalScale: sharesDecimalPlaces,
                                                                        groupSeparator,
                                                                        decimalSeparator,
                                                                        prefix: "U$D "
                                                                    })}
                                                                    &nbsp;
                                                                    {t(Math.abs(content.shares) === 1 ? "share" : "shares")}
                                                                    {(content?.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.tableColSharePrice}>
                                                                <Text style={{ ...styles.tableCell, textAlign: "right" }} >
                                                                    {
                                                                        `${content.sharePrice ?
                                                                            formatValue({
                                                                                value: (Math.abs(content.sharePrice) || 0) + "",
                                                                                decimalScale: "2",
                                                                                groupSeparator,
                                                                                decimalSeparator,
                                                                                prefix: "U$D "
                                                                            })
                                                                            :
                                                                            "-"
                                                                        }`
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style={styles.tableColAmount}>
                                                                <Text style={{
                                                                    ...styles.tableCell,
                                                                    ...isTransfer ? (incomingTransfer() ? styles.textGreen : styles.textRed) : (Math.sign(content.shares) === 1 ? styles.textGreen : styles.textRed),
                                                                    textAlign: "right"
                                                                }} >
                                                                    {isTransfer ? (incomingTransfer() ? '+' : '-') : (Math.sign(content.shares) === 1 ? '+' : '-')}
                                                                    {
                                                                        formatValue({
                                                                            value: amount.toFixed(2),
                                                                            decimalScale: "2",
                                                                            groupSeparator,
                                                                            decimalSeparator,
                                                                            prefix: "U$D "
                                                                        })
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            </Page>
                        ))
                    }

                )
            }
        </Document >
    )
}

export default HoldingsReport