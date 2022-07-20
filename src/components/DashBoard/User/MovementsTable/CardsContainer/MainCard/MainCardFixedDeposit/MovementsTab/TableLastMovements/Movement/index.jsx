import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import axios from 'axios';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { Spinner } from 'react-bootstrap';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useTranslation } from 'react-i18next';

const Movement = ({ content }) => {
  const { t } = useTranslation()
  const { toLogin, getMoveStateById } = useContext(DashBoardContext)

  const [profit, setProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
  const [actualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

  const getAnualRate = () => content.interestRate ?? 0

  const ellapsedDays = () => content.closed ?
    Math.abs(moment(content?.startDate).diff(moment(), "days"))
    :
    content.stateId === 1 ?
      0
      :
      Math.abs(moment(content?.startDate).diff(content?.endDate, "days"))

  const calculateActualProfit = (signal) => {
    if (content.initialAmount) {
      axios.post(`/fixed-deposits/profit`,
        {
          duration: ellapsedDays(),
          initialAmount: content?.initialAmount,
          interestRate: getAnualRate()
        }, { signal: signal }).then(function (response) {
          if (response.status < 300 && response.status >= 200) {
            setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || content.initialAmount } }))
          } else {
            switch (response.status) {
              case 401:
                toLogin();
                break;
              default:
                setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
                break
            }
          }
        }).catch((err) => {
          if (err.message !== "canceled") {
            setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
          }
        });
    }
  }

  const calculateProfit = (signal) => {
    if (content.initialAmount) {
      axios.post(`/fixed-deposits/profit`,
        {
          duration: content?.duration,
          initialAmount: content?.initialAmount,
          interestRate: getAnualRate()
        }, { signal: signal }).then(function (response) {
          if (response.status < 300 && response.status >= 200) {
            setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || content.initialAmount } }))
          } else {
            switch (response.status) {
              case 401:
                toLogin();
                break;
              default:
                setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
                break
            }
          }
        }).catch((err) => {
          if (err.message !== "canceled") {
            setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
          }
        });
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    calculateProfit(signal)
    calculateActualProfit()

    return () => {
      controller.abort();
    };
    //eslint-disable-next-line
  }, [])

  return (
    <tr>
      <td className="tableId">{content.id}</td>
      <td className="tableDate">{t(getMoveStateById(content.stateId).name)}</td>
      <td className="tableDate">{moment(content.createdAt).format('DD/MM/YYYY')}</td>
      <td className={`tableAmount`}>
        <FormattedNumber value={content.initialAmount} prefix="$" fixedDecimals={2} />
      </td>
      <td className={`tableAmount`}>
        <FormattedNumber value={content.interestRate} suffix="%" fixedDecimals={2} />
      </td>
      <td className={`tableAmount`}>
        {ellapsedDays()} {t("days")}
      </td>
      <td className="tableDate">{content.duration} {t("days")}</td>
      <td className={`tableAmount`}>
        {
          content.closed ?
            "-"
            :
            actualProfit.fetching ?
              <Spinner animation="border" size="sm" />
              :
              <FormattedNumber value={actualProfit.value} prefix="$" fixedDecimals={2} />
        }
      </td>
      <td className={`tableAmount`}>
        {
          profit.fetching ?
            <Spinner animation="border" size="sm" />
            :
            <FormattedNumber value={profit.value} prefix="$" fixedDecimals={2} />
        }
      </td>
      <td className="tableDate">{t(content.closed ? "Closed" : "Opened")}</td>
      <td className="tableDate">{content.startDate ? moment(content.startDate).format('DD/MM/YYYY') : "-"}</td>
      <td className="tableDate">{content.endDate ? moment(content.endDate).format('DD/MM/YYYY') : "-"}</td>
    </tr>
  )
}
export default Movement
