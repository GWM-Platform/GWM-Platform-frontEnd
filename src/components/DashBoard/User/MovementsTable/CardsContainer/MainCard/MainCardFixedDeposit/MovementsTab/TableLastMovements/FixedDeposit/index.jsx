import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import { Badge, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import axios from 'axios';
import ReactPDF from '@react-pdf/renderer';
import FixedDepositReceipt from 'Receipts/FixedDepositReceipt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { getAnualRate, getDuration, wasEdited } from 'utils/fixedDeposit';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getFixedDepositType } from 'components/DashBoard/User/newTicket/FixedDeposit/RuleSelector';
import TooltipInfo from 'components/DashBoard/Admin/Broadcast/TooltipInfo';
import Decimal from 'decimal.js';

const FixedDeposit = ({ content }) => {
  const { t } = useTranslation();
  const { toLogin, AccountSelected } = useContext(DashBoardContext)

  const closedAtTheEnd = () => moment(content.endDate).isBefore(moment(content.updatedAt))

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
      case 5://Client pending
        return {
          bg: "warning",
          text: "Client pending"
        }
      case 6://Client pending
        return {
          bg: "warning",
          text: "Admin sign pending"
        }
      default:
        return {
          bg: "danger",
          text: "Denied"
        }
    }
  }

  const [GeneratingPDF, setGeneratingPDF] = useState(false)
  const [ProfitAtTheEnd, setProfitAtTheEnd] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
  const [ActualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
  const [RefundedProfit, setRefundedProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

  const ellapsedDays = () => {
    switch (content.stateId) {
      case 1://pending
        return 0
      case 2://Approved
        if (content.closed) {
          if (closedAtTheEnd()) {
            return getDuration(content)
          } else {
            return (Math.floor(new Date(content?.updatedAt).getTime() / 1000 / 60 / 60 / 24) -
              Math.floor(new Date(content?.startDate).getTime() / 1000 / 60 / 60 / 24)) ?? 0
          }
        } else {
          return (Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24) -
            Math.floor(new Date(content?.startDate).getTime() / 1000 / 60 / 60 / 24)) ?? 0
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
          interestRate: getAnualRate(content)
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
          duration: getDuration(content),
          initialAmount: content?.initialAmount,
          interestRate: getAnualRate(content)
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
          interestRate: getAnualRate(content)
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


  const renderAndDownloadPDF = async () => {
    setGeneratingPDF(true)
    const blob = await ReactPDF.pdf(<FixedDepositReceipt FixedDeposit={{
      ...content, ...{
        accountAlias: AccountSelected.alias,
        ActualProfit: { ...ActualProfit },
        ProfitAtTheEnd: { ...ProfitAtTheEnd },
        RefundedProfit: { ...RefundedProfit },
        ellapsedDays: ellapsedDays(),
        AnualRate: getAnualRate(content),
        state: status()
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Time deposit")} #${content.id}.pdf`)
    // 3. Append to html page
    document.body.appendChild(link)
    // 4. Force download
    link.click()
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link)
    setGeneratingPDF(false)
  }

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

  const [showClick, setShowClick] = useState(false)
  const [showHover, setShowHover] = useState(false)

  const denialMotive = content?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
  const fixedDepositType = getFixedDepositType(content.type)
  const resumeItems = fixedDepositType?.getResumeItems ? fixedDepositType?.getResumeItems({
    anualRate: getAnualRate(content),
    data: {
      amount: content.initialAmount,
      days: content.duration,
      daysInterval: content?.daysInterval,
      startDate: content.startDate,
      lastAccreditationDate: content.lastAccreditationDate
    }
  }) : null
  const creditedInterests = (resumeItems?.creditingDetail || []).filter(creditingDetail => creditingDetail.credited)
  const nextToBeCredited = (resumeItems?.creditingDetail || []).find(creditingDetail => !creditingDetail.credited)
  const totalUtilitiesWithdrawalCredited = Decimal(resumeItems?.creditingInterest || 0).times(creditedInterests?.length || 0)

  return (
    <div className='mobileMovement'>
      <div className='d-flex  py-1 align-items-center' >
        <span className="h5 mb-0  me-1 me-md-2">
          {t("Time deposit")}&nbsp;#{content.id}
        </span>
        {
          (fixedDepositType || wasEdited(content)) &&
          <span className="h5 mb-0 me-1 me-md-2">
            |&nbsp;
            {
              fixedDepositType &&
              <>
                {t(fixedDepositType.label)}
                <TooltipInfo text={t(fixedDepositType.desc)} />
              </>
            }
            {
              wasEdited(content) &&
              <>
                {fixedDepositType && ", "}
                {t("Personalized  *")}
              </>

            }
          </span>
        }
        <div className='ms-auto me-2'>
          {
            GeneratingPDF ?
              <Spinner animation="border" size="sm" />
              :
              <button className='noStyle py-0' style={{ cursor: "pointer" }} onClick={() => renderAndDownloadPDF()}>
                <FontAwesomeIcon icon={faFilePdf} />
              </button>
          }
        </div>
        <Badge bg={status()?.bg}>{t(status().text)}</Badge>
        {
          !!(!!(denialMotive)) &&
          <OverlayTrigger
            show={showClick || showHover}
            placement="right"
            delay={{ show: 250, hide: 400 }}
            popperConfig={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
            overlay={
              <Tooltip className="mailTooltip" id="more-units-tooltip">
                {!!(denialMotive) &&
                  <div>
                    {t('Denial motive')}:<br />
                    <span className="text-nowrap">"{denialMotive.text}"</span>
                  </div>
                }
              </Tooltip>
            }
          >
            <span>
              <button
                onBlur={() => setShowClick(false)}
                onClick={() => setShowClick(prevState => !prevState)}
                onMouseEnter={() => setShowHover(true)}
                onMouseLeave={() => setShowHover(false)}
                type="button" className="noStyle pe-0 ps-1"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
            </span>
          </OverlayTrigger>
        }
      </div >
      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

      <div className='d-flex justify-content-between'>
        <span >{t("Investment initial amount")}:&nbsp;<FormattedNumber value={content.initialAmount} prefix="U$D " fixedDecimals={2} /></span>
      </div >
      {
        resumeItems?.inAdvance &&
        <div className='d-flex justify-content-between'>
          <span >{
            (content.stateId === 1 || content.stateId === 5 || content.stateId === 6) ?
              t("Interest crediting in advance (when the ticket is approved)")
              :
              content.stateId === 2 ?
                t("Interest credited in advance")
                :
                // denied
                content.stateId === 3 ?
                  t("Advance interest accreditation (if the ticket had been approved)")
                  :
                  t("Interest crediting in advance (when the ticket is approved)")

          }:&nbsp;<FormattedNumber value={Decimal(resumeItems?.inAdvance).toFixed(2)} prefix="U$D " fixedDecimals={2} /></span>
        </div >
      }
      {
        resumeItems?.creditingDetail &&
        <div className='d-flex justify-content-between'>
          <span >
            {t("Interest credited")}:&nbsp;
            {
              (creditedInterests.length === 0) ? t("None yet") : <>
                {t("{{times}} times", { times: creditedInterests.length })},&nbsp;
                <FormattedNumber value={resumeItems.creditingInterest || 0} prefix="U$D " fixedDecimals={2} /> {t("each")}, <FormattedNumber value={Decimal(resumeItems.creditingInterest).times(creditedInterests.length).toFixed(2)} prefix="U$D " fixedDecimals={2} /> {t("in total")}
              </>
            }
          </span>
        </div >
      }
      {
        content.lastAccreditationDate &&
        <div className='d-flex justify-content-between'>
          <span >
            {t("Last interest credited")}:&nbsp;{moment(content.lastAccreditationDate).format("L")}
          </span>
        </div>
      }
      {
        nextToBeCredited &&
        <div className='d-flex justify-content-between'>
          <span >
            {t("Next interest to be credited")}:&nbsp;{moment(nextToBeCredited.date).format("L")}
          </span>
        </div>
      }
      {
        resumeItems?.finalPayment &&
        <div className='d-flex justify-content-between'>
          <span >
            {t("Final payment")}:
            &nbsp;<span className="emphasis">
              {moment(content.startDate).add(content.days, 'days').format("L")}, <FormattedNumber value={resumeItems.finalPayment} prefix="U$D " fixedDecimals={2} />
            </span>
            {
              content.type === "withdrawal" &&
              <>
                :
                &nbsp;<span className="emphasis"><FormattedNumber value={content.initialAmount} prefix="U$D " fixedDecimals={2} /></span>
                &nbsp;({t("Initial investment")})
                {
                  resumeItems.hasRest &&
                  <>
                    &nbsp;+&nbsp;<span className="emphasis"><FormattedNumber value={resumeItems.creditingRest} prefix="U$D " fixedDecimals={2} /></span>
                    &nbsp;({t("Rest of interest")}&nbsp;
                    <TooltipInfo
                      tooltipClassName="text-align-start"
                      btnClassName="btn no-style alt-focus m-0 d-inline-block"
                      text={t("As there are less than {{frequency}} days between the last date of interest crediting and the closing date ({{rest}} days), the accumulated interest will be refunded in the final payment along with the initial investment.", {
                        frequency: content.daysInterval,
                        rest: resumeItems.rest
                      })} />)
                  </>
                }
              </>
            }
          </span>
        </div>
      }
      {
        !!(validState(["Ongoing"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Investment current amount")}:&nbsp;
            {
              ActualProfit.fetching ?
                <Spinner animation="border" size="sm" />
                :
                <FormattedNumber value={(Decimal(ActualProfit?.value || 0)?.minus(resumeItems?.inAdvance || totalUtilitiesWithdrawalCredited || 0)?.toFixed(2))} prefix="U$D " fixedDecimals={2} />
            } {
              Decimal(resumeItems?.inAdvance || totalUtilitiesWithdrawalCredited || 0).gt(0) &&
              <>
                {t("in the fixed deposit")}
                <TooltipInfo text={t("Interest based on the annual rate and the initial amount, discounting interest credited in advance")} />, {
                  ActualProfit.fetching ?
                    <Spinner animation="border" size="sm" />
                    :
                    <FormattedNumber value={(Decimal(ActualProfit?.value || 0).toFixed(2))} prefix="U$D " fixedDecimals={2} />
                } {
                  content.type === "inAdvance" ?
                    t("including interest credited in advance")
                    :
                    t("including utilities withdrawal")
                }
              </>
            }
          </span>
        </div >
      }
      {
        !!(validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) &&
        <div className='d-flex justify-content-between' >
          <span >{t("Investment at maturity date")}:&nbsp;
            {ProfitAtTheEnd.fetching ?
              <Spinner animation="border" size="sm" />
              :
              <FormattedNumber value={ProfitAtTheEnd.value} prefix="U$D " fixedDecimals={2} />}
          </span>
        </div >
      }

      {
        !!(validState(["Closed (Out of term)", "Closed (Term completed)"])) &&
        <div className='d-flex justify-content-between' >
          <span >{t("Refund on close")}:&nbsp;
            {RefundedProfit.fetching ?
              <Spinner animation="border" size="sm" />
              :
              <FormattedNumber value={RefundedProfit.value} prefix="U$D " fixedDecimals={2} />}
          </span>
        </div >
      }

      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
      <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
        <span >{t("Duration")}:&nbsp;
          {getDuration(content)}&nbsp;{t("days")}
          {(wasEdited(content)) && " *"}
        </span>
      </div >

      {
        !!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Establishment date")}:&nbsp;
            {moment(content.startDate).format('L')}
          </span>
        </div >
      }

      {
        !!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
        <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
          <span >{t("Maturity date")}:&nbsp;
            {moment(content.endDate).format('L')}
          </span>
        </div >
      }

      {
        !!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Elapsed")}:&nbsp;
            {ellapsedDays()}&nbsp;{t("days")}
          </span>
        </div >
      }

      {
        !!(validState(["Closed (Term completed)", "Closed (Out of term)"])) &&
        <div className='d-flex justify-content-between'>
          <span >{t("Close date")}:&nbsp;
            {moment(content.updatedAt).format('L')}
          </span>
        </div >
      }

      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
      <div className='d-flex justify-content-between'>
        <span >{t("Anual rate")}:&nbsp;
          <FormattedNumber className={`bolder`} value={getAnualRate(content)} suffix="%" fixedDecimals={2} />
          {wasEdited(content) && " *"}
        </span>
      </div >



    </div >
  )


}
export default FixedDeposit
