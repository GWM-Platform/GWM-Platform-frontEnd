import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
//import Lato from 'Fonts/Lato-Regular.ttf'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { formatValue } from '@osdiab/react-currency-input-field'
import Decimal from 'decimal.js'

const MovementReceipt = ({ Movement }) => {
  Decimal.set({ precision: 100 })

  const { t } = useTranslation();

  return (
    <Document>
      <Page size="A4" style={{ display: 'block', height: '100%', width: '100%' }}>
        <Image fixed src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} style={styles.pageBackground} />
        <View
          style={styles.container}
        >
          <View
            style={styles.header}
          >
            <View style={styles.header.textContainer}>
              <Text style={styles.header.textContainer.text}>{t("Receipt of movement #")}{Movement?.id}</Text>
              <Text style={styles.header.textContainer.date}>{moment().format("DD MMM YYYY")}</Text>
            </View>
            <Image src={`${process.env.PUBLIC_URL}/images/PDF/logo.png`} style={styles.header.image} />
          </View>
          <View
            style={styles.body}
          >
            <View style={styles.body.cuentaYEstado}>
              <View >
                <Text style={styles.body.label}>
                  {t("Account")}:
                </Text>
                <Text style={styles.body.data}>
                  {t(Movement.accountAlias)}
                </Text>
              </View>
              <View style={styles.body.cuentaYEstado.estado[{ "1": "info", "2": "success", "3": "danger", "4": "success" }[Movement?.stateId.toString()]]} >
                <Text>
                  {t(Movement.state)}
                </Text>
              </View>
            </View>

            <View style={styles.body.section}>
              <Text style={styles.body.label}>
                {t("Operation date")}:
              </Text>
              <Text style={styles.body.data} >
                {moment(Movement?.createdAt).format("DD MMM YYYY")}
              </Text>
            </View >

            <View style={styles.body.section}>
              <Text style={styles.body.label}>
                {t("Concept")}:
              </Text>
              <Text style={styles.body.data} >
                {t(Movement.motive + (Movement.motive === "REPAYMENT" ? Movement.fundName ? "_" + Movement.fundName : "_" + Movement.fixedDepositId : ""), { fund: Movement.fundName, fixedDeposit: Movement.fixedDepositId })}
              </Text>
            </View >
            
            <View style={styles.body.section}>
              <Text style={styles.body.label}>
                {t("Amount")}:
              </Text>
              <Text style={styles.body.data}>
                {Math.sign(Movement.amount) === 1 ? '+' : '-'}
                {
                  formatValue({
                    value: new Decimal(Movement?.amount || 0).abs().toFixed(2),
                    groupSeparator: '.',
                    decimalSeparator: ',',
                    prefix: "U$D"
                  })
                }
              </Text>
            </View>
          </View>
        </View>
      </Page >
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
    padding: '50px 50px 0px 50px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: '100px',
    width: '100%',
    backgroundColor: '#082044',
    padding: '20px',
    image: {
      height: '50px',
      width: '50px',
      backgroundColor: 'white',
      borderRadius: '50%',
      padding: '8px'
    },
    textContainer: {
      height: "90%",
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
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
    display: 'block',
    height: 'calc( 100% - 100px )',
    width: '100%',
    padding: "20px",
    backgroundColor: 'rgba(245,245,245)',
    label: {
      fontSize: "14px"
    },
    data: {
      fontSize: "20px"
    },
    section: {
      marginBottom: "20px"
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