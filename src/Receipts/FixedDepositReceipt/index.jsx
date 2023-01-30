import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
//import Lato from 'Fonts/Lato-Regular.ttf'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import Decimal from 'decimal.js'

const FixedDepositReceipt = ({ FixedDeposit }) => {
    Decimal.set({ precision: 100 })

    const { t } = useTranslation();

    const validState = (states = []) => states.includes(FixedDeposit.state.text)

    return (
        <Document>
            <Page size={[841.89, 450]} style={{ display: 'block', height: '100%', width: '100%' }}>

                <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
                <View
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <Image src={`${process.env.PUBLIC_URL}/images/PDF/logo.png`} style={styles.header.image} />
                        <View style={styles.header.textContainer}>
                            <Text style={styles.header.textContainer.text}>{t("Transaction receipt")}</Text>
                        </View>
                    </View>
                    <View style={styles.body} >
                        <View style={styles.body.biggerCol}>

                            <View style={styles.body.section}>
                                <Text style={styles.body.label}>
                                    {t("Account")}:
                                </Text>
                                <Text style={styles.body.data} >
                                    {t(FixedDeposit.accountAlias)}
                                </Text>
                            </View >

                            <View style={styles.body.section}>
                                <Text style={styles.body.label}>
                                    {t("Operation status")}
                                </Text>
                                <Text style={styles.body.data} >
                                    {t(FixedDeposit.state.text)}
                                </Text>
                            </View >

                            <View style={styles.body.section}>
                                <Text style={styles.body.label}>
                                    {t("Investment initial amount")}:
                                </Text>
                                <Text style={styles.body.data} >
                                    {
                                        formatValue({
                                            value: new Decimal(FixedDeposit?.initialAmount || 0).abs().toFixed(2),
                                            groupSeparator: '.',
                                            decimalSeparator: ',',
                                            prefix: "U$D"
                                        })
                                    }
                                </Text>
                            </View >

                            {
                                !!(validState([])) &&
                                <View style={styles.body.section}>
                                    <Text style={styles.body.label}>
                                        {t("Investment current amount")}:
                                    </Text>
                                    <Text style={styles.body.data}>
                                        {
                                            formatValue({
                                                value: new Decimal(FixedDeposit?.ActualProfit.value || 0).abs().toFixed(2),
                                                groupSeparator: '.',
                                                decimalSeparator: ',',
                                                prefix: "U$D"
                                            })
                                        }
                                    </Text>
                                </View>
                            }

                            {
                                !!(validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) &&
                                <View style={styles.body.section}>
                                    <Text style={styles.body.label}>
                                        {t("Investment at maturity date")}:
                                    </Text>
                                    <Text style={styles.body.data}>
                                        {
                                            formatValue({
                                                value: new Decimal(FixedDeposit?.ProfitAtTheEnd.value || 0).abs().toFixed(2),
                                                groupSeparator: '.',
                                                decimalSeparator: ',',
                                                prefix: "U$D"
                                            })
                                        }
                                    </Text>
                                </View>
                            }


                            {
                                !!(validState(["Closed (Out of term)", "Closed (Term completed)"])) &&
                                <View style={styles.body.section}>
                                    <Text style={styles.body.label}>
                                        {t("Refund on close")}:
                                    </Text>
                                    <Text style={styles.body.data}>
                                        {
                                            formatValue({
                                                value: new Decimal(FixedDeposit?.RefundedProfit.value || 0).abs().toFixed(2),
                                                groupSeparator: '.',
                                                decimalSeparator: ',',
                                                prefix: "U$D"
                                            })
                                        }
                                    </Text>
                                </View>

                            }

                            <View style={styles.body.section}>
                                <Text style={styles.body.label}>
                                    {t("Duration")}:
                                </Text>
                                <Text style={styles.body.data}>
                                    {FixedDeposit?.duration}&nbsp;{t("days")}
                                </Text>
                            </View>

                            {
                                !!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
                                <View style={styles.body.section}>
                                    <Text style={styles.body.label}>
                                        {t("Establishment date")}:
                                    </Text>
                                    <Text style={styles.body.data}>
                                        {moment(FixedDeposit?.startDate).format('l')}
                                    </Text>
                                </View>
                            }

                            {
                                !!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
                                <View style={styles.body.section}>
                                    <Text style={styles.body.label}>
                                        {t("Maturity date")}:
                                    </Text>
                                    <Text style={styles.body.data}>
                                        {moment(FixedDeposit?.endDate).format('l')}
                                    </Text>
                                </View>
                            }

                            {
                                !!(validState(["Closed (Term completed)", "Closed (Out of term)"])) &&
                                <View style={styles.body.section}>
                                    <Text style={styles.body.label}>
                                        {t("Close date")}:
                                    </Text>
                                    <Text style={styles.body.data}>
                                        {moment(FixedDeposit?.updatedAt).format('D MMM YY')}

                                    </Text>
                                </View>
                            }

                            <View style={styles.body.section}>
                                <Text style={styles.body.label}>
                                    {t("Anual rate")}:
                                </Text>
                                <Text style={styles.body.data}>
                                    {
                                        formatValue({
                                            value: new Decimal(FixedDeposit?.AnualRate || 0).abs().toFixed(2),
                                            groupSeparator: '.',
                                            decimalSeparator: ',',
                                            suffix: "%"
                                        })
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.body.smallerCol}>
                            <View style={styles.body.smallerCol.section}>
                                <Text style={styles.body.smallerCol.label}>
                                    {t("Ticket N°")}
                                </Text>
                                <Text style={styles.body.smallerCol.data} >
                                    {t("Time deposit")} #{FixedDeposit?.id}
                                </Text>
                            </View >
                            <View style={styles.body.smallerCol.section}>
                                <Text style={styles.body.smallerCol.label}>
                                    {t("Operation date")}
                                </Text>
                                <Text style={styles.body.smallerCol.data} >
                                    {moment(FixedDeposit?.createdAt).format("l")}
                                </Text>
                            </View >
                            <View style={styles.body.smallerCol.section}>
                                <Text style={styles.body.smallerCol.label}>
                                    {t("Operation time")}
                                </Text>
                                <Text style={styles.body.smallerCol.data} >
                                    {moment(FixedDeposit?.createdAt).format("HH:mm:ss")}
                                </Text>
                            </View >
                        </View>
                    </View>
                </View>
            </Page >
        </Document >
    )
}

export default FixedDepositReceipt

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