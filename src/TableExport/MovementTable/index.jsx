import React from 'react'

import { Document, Page, Text, View, Image, Font } from '@react-pdf/renderer'
//import SF from 'Fonts/SF-Regular.ttf'
import { useTranslation } from 'react-i18next'
import Decimal from 'decimal.js'
// import { DataTableCell, TableBody, TableCell, TableHeader, Table } from '@david.kucsai/react-pdf-table'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration'
import SfLight from './Fonts/SF/SF-Pro-Text-Light.otf'
import SfMedium from './Fonts/SF/SF-Pro-Text-Medium.otf'
import SfRegular from './Fonts/SF/SF-Pro-Text-Regular.otf'
import SfBold from './Fonts/SF/SF-Pro-Text-Bold.otf'
import SfSemiBold from './Fonts/SF/SF-Pro-Text-Semibold.otf'

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
            backgroundColor: '#082044',
            borderBottomWidth: '1px',
            // borderBottomColor: 'rgb(8, 32, 68)',
            marginBottom: '5px',
            // padding: '20px',
            // marginBottom: '3px',
            image: {
                height: '35px',
                width: '35px',
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '5px',
                marginLeft: "auto",
                marginRight: '10px',
            },
            textContainer: {
                marginLeft: '10px',
                text: {
                    color: "rgba(255,255,255,.95)",
                    fontSize: "16px",
                    fontFamily: 'SF',
                    textAlign: "end",
                },
                textBold: {
                    color: "rgba(255,255,255,.95)",
                    fontSize: "16px",
                    fontFamily: 'SF',
                    fontWeight: 'bold',
                    textAlign: "end",
                },
                smaller: {
                    color: "rgba(255,255,255,.95)",
                    fontSize: "12px",
                    fontFamily: 'SF',
                    fontWeight: 'light',
                    textAlign: "end",
                }
            }
        },
        body: {
            display: 'flex',
            flexDirection: 'row',
            height: 'calc( 100% - 55px )',
            width: '100%',
            padding: "20px",
            paddingTop: "0",
            backgroundColor: 'rgba(245,245,245)',
        }
    }

    return (
        <Document>
            {paginatedMovements.map((pageMovements, pageIndex) => (
                <Page key={pageIndex} style={{ display: 'block', height: '100%', width: '100%', backgroundColor: "#FFFFFF" }}>
                    <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.header.textContainer}>

                                <Text style={styles.header.textContainer.text}>
                                    <Text style={styles.header.textContainer.textBold}>{t("Cash")}</Text>, {t("Client")} {headerInfo?.clientName}
                                </Text>
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
                                        const isPerformanceMovement = (content.motive === "PENALTY_WITHDRAWAL" || content.motive === "PROFIT_DEPOSIT")
                                        const noteFromAdmin = isPerformanceMovement && content?.notes?.find(note => note.noteType === "CLIENT_NOTE")

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
                                                                        isPerformanceMovement ? `${t(content.motive)} (${noteFromAdmin ? noteFromAdmin?.text : t(content.motive === "PENALTY_WITHDRAWAL" ? "penalty" : "bonification")})` :
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
            ))}
        </Document >
    )
}

export default MovementTable