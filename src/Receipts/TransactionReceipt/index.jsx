import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
//import Lato from 'Fonts/Lato-Regular.ttf'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import Decimal from 'decimal.js'

const TransactionReceipt = ({ Transaction }) => {
  Decimal.set({ precision: 100 })

  const { t } = useTranslation();

  const decimalSharesAbs = new Decimal(Transaction?.shares || 0).abs()
  const decimalPrice = new Decimal(Transaction?.sharePrice || 0)
  const amount = new Decimal(Decimal(decimalSharesAbs.toString()).times(decimalPrice))

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
                  {t("Account")}
                </Text>
                <Text style={styles.body.data} >
                  {Transaction?.accountAlias}
                </Text>
              </View >

              <View style={styles.body.section}>
                <Text style={styles.body.label}>
                  {t("Operation status")}
                </Text>
                <Text style={styles.body.data} >
                  <View style={styles.body.cuentaYEstado.estado[{ "1": "info", "2": "success", "3": "danger", "4": "success" }[Transaction?.stateId.toString()]]} >
                    <Text>
                      {t(Transaction?.state)}
                    </Text>
                  </View>
                </Text>
              </View >

              <View style={styles.body.section}>
                <Text style={styles.body.label}>
                  {t("Operation type")}
                </Text>
                <Text style={styles.body.data} >
                  {t("Shares transaction")}
                </Text>
              </View >

              <View style={styles.body.section}>
                <Text style={styles.body.label}>
                  {t("Fund")}
                </Text>
                <Text style={styles.body.data} >
                  {Transaction.fundName}
                </Text>
              </View >

              <View style={styles.body.section}>
                <Text style={styles.body.label}>
                  {t("Concept")}:
                </Text>
                <Text style={styles.body.data} >
                  {Math.sign(Transaction?.shares) === 1 ? t('Purchase') : t('Sale')}
                </Text>
              </View >

              <View style={styles.body.section}>
                <Text style={styles.body.label}>
                  {t("Amount (Shares)")}
                </Text>
                <Text style={styles.body.data} >
                  {
                    formatValue({
                      value: new Decimal(Transaction?.shares || 0).abs().toFixed(2),
                      groupSeparator: '.',
                      decimalSeparator: ','
                    })
                  }
                </Text>
              </View >

              <View style={styles.body.section}>
                <Text style={styles.body.label}>
                  {t("Share price")}
                </Text>
                <Text style={styles.body.data} >
                  {
                    formatValue({
                      value: new Decimal(Transaction?.sharePrice || 0).toFixed(2),
                      groupSeparator: '.',
                      decimalSeparator: ',',
                      prefix: "U$D "
                    })
                  }
                </Text>
              </View >

              <View style={styles.body.section}>
                <Text style={styles.body.label}>
                  {t("Amount")}
                </Text>
                <Text style={styles.body.data} >
                  {Transaction?.receiverId === Transaction?.AccountId ? '+' : '-'}
                  {
                    formatValue({
                      value: new Decimal(amount || 0).abs().toFixed(2),
                      groupSeparator: '.',
                      decimalSeparator: ',',
                      prefix: "U$D "
                    })
                  }
                </Text>
              </View >
            </View>
            <View style={styles.body.smallerCol}>
              <View style={styles.body.smallerCol.section}>
                <Text style={styles.body.smallerCol.label}>
                  {t("Ticket N°")}
                </Text>
                <Text style={styles.body.smallerCol.data} >
                  {t("Transaction")} #{Transaction?.id}
                </Text>
              </View >
              <View style={styles.body.smallerCol.section}>
                <Text style={styles.body.smallerCol.label}>
                  {t("Operation date")}
                </Text>
                <Text style={styles.body.smallerCol.data} >
                  {moment(Transaction?.createdAt).format("l")}
                </Text>
              </View >
              <View style={styles.body.smallerCol.section}>
                <Text style={styles.body.smallerCol.label}>
                  {t("Operation time")}
                </Text>
                <Text style={styles.body.smallerCol.data} >
                  {moment(Transaction?.createdAt).format("HH:mm:ss")}
                </Text>
              </View >
            </View>
          </View>
        </View>
      </Page >
    </Document >
  )
}

export default TransactionReceipt

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
    padding: '50px 50px 50px 50px',
    borderRadius: "5%"
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
      borderRadius: '15%',
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
        marginBottom: "5px",
        marginLeft: "15px"
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
        marginBottom: "5px"
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