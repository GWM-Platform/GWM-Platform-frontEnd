import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import { Badge, Spinner } from 'react-bootstrap';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import axios from 'axios';

const FixedDeposit = ({ content }) => {
  const { t } = useTranslation();
  const { toLogin } = useContext(DashBoardContext)

  const status = () => {
    switch (content.stateId) {
      case 1://pending
        return {
          bg: "info",
          text: "Pending"
        }
      case 2://Approved
        if (content.closed) {
          if (closedAtTheEnd()) {
            return {
              bg: "success",
              text: "Closed (Term completed)"
            }
          } else {
            return {
              bg: "success",
              text: "Closed (Out of term)"
            }
          }
        } else {
          return {
            bg: "primary",
            text: "Ongoing"
          }
        }
      case 3://Denied
        return {
          bg: "danger",
          text: "Denied"
        }
      default:
        return {
          bg: "danger",
          text: "Denied"
        }
    }
  }

  const [ProfitAtTheEnd, setProfitAtTheEnd] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
  const [ActualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
  const [RefundedProfit, setRefundedProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

  const getAnualRate = () => content.interestRate ?? 0

  const ellapsedDays = () => {
    switch (content.stateId) {
      case 1://pending
        return 0
      case 2://Approved
        if (content.closed) {
          if (closedAtTheEnd()) {
            return content.duration
          } else {
            return (Math.floor(moment(content?.updatedAt).toDate().getTime() / 1000 / 60 / 60 / 24) -
              Math.floor(moment(content?.startDate).toDate().getTime() / 1000 / 60 / 60 / 24)) ?? 0
          }
        } else {
          return (Math.floor(moment().toDate().getTime() / 1000 / 60 / 60 / 24) -
            Math.floor(moment(content?.startDate).toDate().getTime() / 1000 / 60 / 60 / 24)) ?? 0
        }
      case 3://Denied
        return 0
      default:
        return 0
    }
  }

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

  const calculateProfitAtTheEnd = (signal) => {
    if (content.initialAmount) {
      axios.post(`/fixed-deposits/profit`,
        {
          duration: content?.duration,
          initialAmount: content?.initialAmount,
          interestRate: getAnualRate()
        }, { signal: signal }).then(function (response) {
          if (response.status < 300 && response.status >= 200) {
            setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || content.initialAmount } }))
          } else {
            switch (response.status) {
              case 401:
                toLogin();
                break;
              default:
                setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
                break
            }
          }
        }).catch((err) => {
          if (err.message !== "canceled") {
            setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
          }
        });
    }
  }

  const calculateRefundedProfit = (signal) => {
    if (content.initialAmount) {
      axios.post(`/fixed-deposits/profit`,
        {
          duration: ellapsedDays(),
          initialAmount: content?.initialAmount,
          interestRate: getAnualRate()
        }, { signal: signal }).then(function (response) {
          if (response.status < 300 && response.status >= 200) {
            setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || content.initialAmount } }))
          } else {
            switch (response.status) {
              case 401:
                toLogin();
                break;
              default:
                setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
                break
            }
          }
        }).catch((err) => {
          if (err.message !== "canceled") {
            setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: content.initialAmount } }))
          }
        });
    }
  }

  const closedAtTheEnd = () => moment(content.endDate).isBefore(moment(content.updatedAt))

  const validState = (states = []) => states.includes(status().text)

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) calculateProfitAtTheEnd(signal)
    if (validState(["Ongoing"])) calculateActualProfit(signal)
    if (validState(["Closed (Out of term)", "Closed (Term completed)"])) calculateRefundedProfit(signal)

    return () => {
      controller.abort();
    };
    //eslint-disable-next-line
  }, [])


  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between py-1 align-items-center' >
        <span className="h4 mb-0">{t("Time deposit")}&nbsp;#{content.id}</span>
        <Badge bg={status()?.bg}>{t(status().text)}</Badge>
      </div >
      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

      <div className='d-flex justify-content-between'>
        <span >{t("Investment initial amount")}:&nbsp;<FormattedNumber value={content.initialAmount} prefix="$" fixedDecimals={2} /></span>
      </div >
      {
        !!(validState(["Ongoing"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Investment current amount")}:&nbsp;
            {ActualProfit.fetching ?
              <Spinner animation="border" size="sm" />
              :
              <FormattedNumber value={ActualProfit.value} prefix="$" fixedDecimals={2} />}
          </span>
        </div >
      }
      {
        !!(validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) &&
        <div className='d-flex justify-content-between' >
          <span >{t("Investment upon closing within the agreed term")}:&nbsp;
            {ProfitAtTheEnd.fetching ?
              <Spinner animation="border" size="sm" />
              :
              <FormattedNumber value={ProfitAtTheEnd.value} prefix="$" fixedDecimals={2} />}
          </span>
        </div >
      }
      {!!(validState(["Closed (Out of term)", "Closed (Term completed)"])) &&
        <div className='d-flex justify-content-between' >
          <span >{t("Refund on close")}:&nbsp;
            {RefundedProfit.fetching ?
              <Spinner animation="border" size="sm" />
              :
              <FormattedNumber value={RefundedProfit.value} prefix="$" fixedDecimals={2} />}
          </span>
        </div >
      }
      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
      <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
        <span >{t("Duration (Agreed)")}:&nbsp;
          {content.duration}{t("days")}
        </span>
      </div >

      {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Time deposit Start date")}:&nbsp;
            {moment(content.startDate).format('L')}
          </span>
        </div >}

      {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
        <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
          <span >{t("End date (Agreed)")}:&nbsp;
            {moment(content.endDate).format('L')}
          </span>
        </div >}

      {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Elapsed")}:&nbsp;
            {ellapsedDays()}&nbsp;{t("days")}
          </span>
        </div >}

      {!!(validState(["Closed (Term completed)", "Closed (Out of term)"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Close date")}:&nbsp;
            {moment(content.updatedAt).format('L')}
          </span>
        </div >}

      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
      <div className='d-flex justify-content-between'>
        <span >{t("Anual rate")}:&nbsp;
          <FormattedNumber value={getAnualRate()} suffix="%" fixedDecimals={2} />
        </span>
      </div >



    </div >
  )


}
export default FixedDeposit
