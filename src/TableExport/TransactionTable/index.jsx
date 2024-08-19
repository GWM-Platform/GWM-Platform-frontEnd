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


const TransactionTable = ({ transactions, headerInfo, sharesDecimalPlaces = 5, AccountSelected }) => {
    Decimal.set({ precision: 100 })

    const { t } = useTranslation();
    const paginatedTransactions = paginate(transactions, 38);

    const greaterAmount = transactions.reduce((acc, content) => {
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


    const greaterSharePrice = transactions.reduce((acc, content) => {
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

    return (
        <Document>
            {paginatedTransactions.map((pageTransactions, pageIndex) => (
                <Page key={pageIndex} style={{ display: 'block', height: '100%', width: '100%' }}>
                    <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.header.textContainer}>
                                <Text style={styles.header.textContainer.text}>
                                    <Text style={styles.header.textContainer.textBold}>{t("Fund")} {headerInfo.fundName}</Text>, {t("Client")} {headerInfo?.clientName}
                                </Text>
                            </View>
                            <View style={styles.header.textContainer.row}>
                                <Text style={styles.header.textContainer.smaller}>
                                    {t("Balance (shares)")}: {formatValue({
                                        value: (headerInfo?.balance || 0) + "",
                                        decimalScale: "2",
                                        groupSeparator,
                                        decimalSeparator,
                                    })
                                    }
                                </Text>
                                <Text style={styles.header.textContainer.smaller}>
                                    {t("Share price")}: {formatValue({
                                        value: (headerInfo?.sharePrice || 0) + "",
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
                                        value: headerInfo?.balanceInCash,
                                        decimalScale: "2",
                                        groupSeparator,
                                        decimalSeparator,
                                    })
                                    }
                                </Text>
                                <Text style={styles.header.textContainer.smaller}>
                                    {t("Accumulated performance")}: {formatValue({
                                        value: (headerInfo?.performance || 0) + "",
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
                                    {t("Pending transactions (shares)")}: {formatValue({
                                        value: (headerInfo?.pendingshares || 0) + "",
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
            ))}
        </Document >
    )
}

export default TransactionTable