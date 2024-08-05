import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
//import Lato from 'Fonts/Lato-Regular.ttf'
import { useTranslation } from 'react-i18next'
import Decimal from 'decimal.js'
// import { DataTableCell, TableBody, TableCell, TableHeader, Table } from '@david.kucsai/react-pdf-table'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration'


const paginate = (array, pageSize) => {
    return array.reduce((acc, _, i) => {
        if (i % pageSize === 0) acc.push(array.slice(i, i + pageSize));
        return acc;
    }, []);
};


const MovementTable = ({ movements, headerInfo }) => {
    Decimal.set({ precision: 100 })

    const { t } = useTranslation();
    const paginatedMovements = paginate(movements, 38);

    const greaterAmount = movements.reduce((acc, content) => {
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
    const greaterBalance = movements.reduce((acc, content) => {
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
            width: "10%", borderStyle: "solid", borderColor: "#dee2e6", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColWidthLeft: {
            width: `${100 - greaterAmount.length - greaterBalance.length - 10}%`, borderStyle: "solid", borderColor: "#dee2e6", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColAmount: {
            width: `${greaterAmount.length}%`, borderStyle: "solid", borderColor: "#dee2e6", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableColBalance: {
            width: `${greaterBalance.length}%`, borderStyle: "solid", borderColor: "#dee2e6", borderBottomWidth: 1, borderLeftWidth: 0, borderTopWidth: 0
        },
        tableCell: {
            margin: 3, fontSize: 10
        },
        tableHeader: {
            fontWeight: 700, margin: 3, fontSize: 12,
        },
        pageBackground: {
            position: 'absolute',
            minWidth: '100%',
            minHeight: '100%',
            display: 'block',
            height: '100%',
            width: '100%'
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
            height: '60px',
            width: '100%',
            backgroundColor: '#082044',
            padding: '20px',
            marginBottom: '5px',
            image: {
                height: '35px',
                width: '35px',
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '5px'
            },
            textContainer: {
                text: {
                    fontSize: "16px",
                    color: "rgba(255,255,255,.95)"
                },
                smaller: {
                    fontSize: "12px",
                    color: "rgba(255,255,255,.95)"
                }
            }
        },
        body: {
            display: 'flex',
            flexDirection: 'row',
            height: 'calc( 100% - 60px )',
            width: '100%',
            padding: "20px",
            backgroundColor: 'rgba(245,245,245)',
        }
    }

    return (
        <Document>
            {paginatedMovements.map((pageMovements, pageIndex) => (
                <Page key={pageIndex} style={{ display: 'block', height: '100%', width: '100%' }}>
                    <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.header.textContainer}>

                                <Text style={styles.header.textContainer.text}>{t("Cash")}, {t("Client")} {headerInfo?.clientName}</Text>
                                <Text style={styles.header.textContainer.smaller}>
                                    {t("Balance")}: {formatValue({
                                        value: (headerInfo?.balance || 0) + "",
                                        decimalScale: "2",
                                        groupSeparator,
                                        decimalSeparator,
                                        prefix: "U$D "
                                    })
                                    }
                                </Text>
                            </View>
                            <Image src={`${process.env.PUBLIC_URL}/images/PDF/logo.png`} style={styles.header.image} />
                        </View>
                        <View>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={{ ...styles.tableColDate, borderColor: "#202020" }}>
                                        <Text style={styles.tableHeader}>{t("Date")}</Text>
                                    </View>
                                    <View style={{ ...styles.tableColWidthLeft, borderColor: "#202020" }}>
                                        <Text style={styles.tableHeader}>{t("Description")}</Text>
                                    </View>
                                    <View style={{ ...styles.tableColAmount, borderColor: "#202020" }}>
                                        <Text style={{ ...styles.tableHeader, textAlign: "right" }}>{t("Amount")}</Text>
                                    </View>
                                    <View style={{ ...styles.tableColBalance, borderColor: "#202020" }}>
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
                                                    <Text style={{ ...styles.tableCell, textAlign: "right" }} >
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
            ))}
        </Document >
    )
}

export default MovementTable