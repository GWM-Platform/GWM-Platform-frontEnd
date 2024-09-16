import React from 'react'

import { Page, Text, View, Image } from '@react-pdf/renderer'
//import SF from 'Fonts/SF-Regular.ttf'
import { useTranslation } from 'react-i18next'
// import { DataTableCell, TableBody, TableCell, TableHeader, Table } from '@david.kucsai/react-pdf-table'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration'
import { paginate } from '..'

export const AccountsStatementDetail = ({ accountsStatement, year, headerInfo }) => {
    const { t } = useTranslation();
    return accountsStatement.map(
        (accountStatement, accountStatementIndex) => {
            const paginatedMovements = paginate(accountStatement.operations.filter(operation => operation.applied && !operation.motive.includes("SHARE_TRANSFER")).reverse(), 38);

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
                    height: '50px',
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
                    height: 'calc( 100% - 50px )',
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
                                {/* <Text style={styles.header.textContainer.text}>
                                    <Text style={styles.header.textContainer.textBold}>{t("Reporte de tenencias al")} {moment().set("year", year).endOf("year").format("L")}</Text>, {t("Client")} {headerInfo?.clientName}
                                </Text> */}
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