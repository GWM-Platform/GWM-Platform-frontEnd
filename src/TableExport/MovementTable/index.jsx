import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
//import Lato from 'Fonts/Lato-Regular.ttf'
import { useTranslation } from 'react-i18next'
import Decimal from 'decimal.js'
import { DataTableCell, TableBody, TableCell, TableHeader, Table } from '@david.kucsai/react-pdf-table'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration'


const paginate = (array, pageSize) => {
    return array.reduce((acc, _, i) => {
        if (i % pageSize === 0) acc.push(array.slice(i, i + pageSize));
        return acc;
    }, []);
};


const MovementReceipt = ({ movements, getMoveStateById }) => {
    Decimal.set({ precision: 100 })

    const { t } = useTranslation();
    const paginatedMovements = paginate(movements, 10);

    return (
        <Document>
            {paginatedMovements.map((pageMovements, pageIndex) => (
                <Page key={pageIndex} size={[841.89, 450]} style={{ display: 'block', height: '100%', width: '100%' }}>
                    <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Image src={`${process.env.PUBLIC_URL}/images/PDF/logo.png`} style={styles.header.image} />
                            <View style={styles.header.textContainer}>
                                <Text style={styles.header.textContainer.text}>{t("Cash_movements")}</Text>
                            </View>
                        </View>
                        <View>
                            <Table data={pageMovements} >
                                <TableHeader>
                                    <TableCell style={{ borderLeft: 0, borderRight: 0 }} >
                                        {t("Date")}
                                    </TableCell>
                                    <TableCell style={{ borderLeft: 0, borderRight: 0 }} >
                                        {t("Status")}
                                    </TableCell>
                                    <TableCell style={{ borderLeft: 0, borderRight: 0 }} >
                                        {t("Description")}
                                    </TableCell>
                                    <TableCell style={{ borderLeft: 0, borderRight: 0 }} >
                                        {t("Amount")}
                                    </TableCell>
                                    <TableCell style={{ borderLeft: 0, borderRight: 0 }} >
                                        {t("Balance")}
                                    </TableCell>
                                </TableHeader>
                                <TableBody>
                                    <DataTableCell style={{ borderLeft: 0, borderRight: 0 }} getContent={(content) => moment(content.createdAt).format('L')} />
                                    <DataTableCell style={{ borderLeft: 0, borderRight: 0 }} getContent={(content) => {
                                        const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
                                        return `${t(getMoveStateById(content.stateId).name)}${(content?.transfer?.reverted && transferNote?.text !== "Transferencia revertida") ? `, ${t("reverted")}` : ""}`
                                    }
                                    } />
                                    <DataTableCell style={{ borderLeft: 0, borderRight: 0 }} getContent={(content) => {
                                        const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
                                        const partialLiquidate = content?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")
                                        const fundLiquidate = content?.notes?.find(note => note.noteType === "FUND_LIQUIDATE")
                                        return `${(!content?.transferReceiver && !content?.transferSender) ?
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
                                    }}
                                    />
                                    <DataTableCell style={{ borderLeft: 0, borderRight: 0 }} getContent={(content) => `${Math.sign(content.amount) === 1 ? '+' : '-'
                                        }${formatValue({
                                            value: (Math.abs(content.amount) || 0) + "",
                                            decimalScale: "2",
                                            groupSeparator,
                                            decimalSeparator,
                                            prefix: "U$D "
                                        })
                                        }`} />
                                    <DataTableCell style={{ borderLeft: 0, borderRight: 0 }} getContent={(content) => `${content.partialBalance ?
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
                                    } />
                                </TableBody>
                            </Table>
                        </View>
                    </View>
                </Page>
            ))}
        </Document >
    )
}

export default MovementReceipt

const styles = {
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
        padding: '50px 50px 50px 50px'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: '70px',
        width: '100%',
        backgroundColor: '#082044',
        padding: '20px',
        marginBottom: '15px',
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
            date: {
                fontSize: "14px",
                color: "rgba(255,255,255,.95)"
            }
        }
    },
    body: {
        display: 'flex',
        flexDirection: 'row',
        height: 'calc( 100% - 70px )',
        width: '100%',
        padding: "20px",
        backgroundColor: 'rgba(245,245,245)',
        biggerCol: {
            flex: "5 1 auto",
            height: "100%",
        },
        smallerCol: {
            flex: "3 1 auto",
            height: "100%",
            label: {
                fontSize: "14px",
                textAlign: "right",
                marginBottom: "5px"
            },
            data: {
                fontSize: "14px",
                textAlign: "right"
            },
            section: {

                marginBottom: "15px"
            }
        },
        label: {
            fontSize: "14px",
        },
        data: {
            fontSize: "14px",
            textAlign: "right"
        },
        section: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: "10px"
        },
        cuentaYEstado: {
            marginBottom: "20px",
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-between",
            estado: {
                info: {
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    height: "100%",
                    backgroundColor: "rgb(13,202,240 )",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                },
                success: {
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    height: "100%",
                    backgroundColor: "rgb(25,135,84)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                },
                primary: {
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    height: "100%",
                    backgroundColor: "rgb(13,110,253)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                },
                danger: {
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    height: "100%",
                    backgroundColor: "rgb(220,53,69)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }
            }
        }
    }
}