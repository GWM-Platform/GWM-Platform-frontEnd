import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faFilePdf, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ReactPDF from '@react-pdf/renderer';
import MovementReceipt from 'Receipts/MovementReceipt';
import { Dropdown, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import MovementConfirmation from 'components/DashBoard/User/MovementsTable/GeneralUse/MovementConfirmation';
import axios from 'axios';
import FixedDepositReceipt from 'Receipts/FixedDepositReceipt';
import { getAnualRate, getDuration } from 'utils/fixedDeposit';
import TransferReceipt from 'Receipts/TransferReceipt';
import TransactionReceipt from 'Receipts/TransactionReceipt';
import ActionConfirmationModal from 'components/DashBoard/User/MovementsTable/GeneralUse/TransferConfirmation'
import { useSelector } from 'react-redux';
import { selectFundById } from 'Slices/DashboardUtilities/fundsSlice';


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    className="noStyle px-0 ps-1"
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

const Movement = ({ content, actions, reloadData }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, AccountSelected, couldSign, hasPermission, toLogin, hasSellPermission, hasBuyPermission, ClientSelected } = useContext(DashBoardContext)

  const [GeneratingPDF, setGeneratingPDF] = useState(false)
  const [altGeneratingPDF, setAltGeneratingPDF] = useState(false)

  const [fixedDeposit, setFixedDeposit] = useState(null)
  const [ProfitAtTheEnd, setProfitAtTheEnd] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
  const [ActualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
  const [RefundedProfit, setRefundedProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

  const renderAndDownloadPDF = async () => {
    setGeneratingPDF(true)
    const blob = await ReactPDF.pdf(<MovementReceipt Movement={{
      ...content, ...{
        state: t(getMoveStateById(content.stateId).name),
        accountAlias: AccountSelected.alias
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Movement")} #${content.id}.pdf`)
    // 3. Append to html page
    document.body.appendChild(link)
    // 4. Force download
    link.click()
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link)
    setGeneratingPDF(false)
  }

  const closedAtTheEnd = () => moment(fixedDeposit.endDate).isBefore(moment(fixedDeposit.updatedAt))

  const status = () => {
    switch (fixedDeposit.stateId) {
      case 1://pending
        return {
          bg: "info",
          text: "Pending"
        }
      case 2://Approved
        if (fixedDeposit.closed) {
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


  const ellapsedDays = () => {
    switch (fixedDeposit.stateId) {
      case 1://pending
        return 0
      case 2://Approved
        if (fixedDeposit.closed) {
          if (closedAtTheEnd()) {
            return getDuration(fixedDeposit)
          } else {
            return (Math.floor(new Date(fixedDeposit?.updatedAt).getTime() / 1000 / 60 / 60 / 24) -
              Math.floor(new Date(fixedDeposit?.startDate).getTime() / 1000 / 60 / 60 / 24)) ?? 0
          }
        } else {
          return (Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24) -
            Math.floor(new Date(fixedDeposit?.startDate).getTime() / 1000 / 60 / 60 / 24)) ?? 0
        }
      case 3://Denied
        return 0
      default:
        return 0
    }
  }

  const calculateActualProfit = () => {
    if (fixedDeposit.initialAmount) {
      axios.post(`/fixed-deposits/profit`,
        {
          duration: ellapsedDays(fixedDeposit),
          initialAmount: fixedDeposit?.initialAmount,
          interestRate: getAnualRate(fixedDeposit)
        }).then(function (response) {
          if (response.status < 300 && response.status >= 200) {
            setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || fixedDeposit.initialAmount } }))
          } else {
            switch (response.status) {
              case 401:
                toLogin();
                break;
              default:
                setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
                break
            }
          }
        }).catch((err) => {
          if (err.message !== "canceled") {
            setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
          }
        });
    }
  }

  const calculateProfitAtTheEnd = () => {
    if (fixedDeposit.initialAmount) {
      axios.post(`/fixed-deposits/profit`,
        {
          duration: getDuration(fixedDeposit),
          initialAmount: fixedDeposit?.initialAmount,
          interestRate: getAnualRate(fixedDeposit)
        }).then(function (response) {
          if (response.status < 300 && response.status >= 200) {
            setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || fixedDeposit.initialAmount } }))
          } else {
            switch (response.status) {
              case 401:
                toLogin();
                break;
              default:
                setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
                break
            }
          }
        }).catch((err) => {
          if (err.message !== "canceled") {
            setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
          }
        });
    }
  }

  const calculateRefundedProfit = () => {
    if (fixedDeposit.initialAmount) {
      axios.post(`/fixed-deposits/profit`,
        {
          duration: ellapsedDays(fixedDeposit),
          initialAmount: fixedDeposit?.initialAmount,
          interestRate: getAnualRate(fixedDeposit)
        }).then(function (response) {
          if (response.status < 300 && response.status >= 200) {
            setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || fixedDeposit.initialAmount } }))
          } else {
            switch (response.status) {
              case 401:
                toLogin();
                break;
              default:
                setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
                break
            }
          }
        }).catch((err) => {
          if (err.message !== "canceled") {
            setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
          }
        });
    }
  }

  const validState = (states = []) => states.includes(status().text)


  const renderAndDownloadFixedDepositPDF = async () => {
    const blob = await ReactPDF.pdf(<FixedDepositReceipt FixedDeposit={{
      ...fixedDeposit, ...{
        accountAlias: AccountSelected.alias,
        ActualProfit: { ...ActualProfit },
        ProfitAtTheEnd: { ...ProfitAtTheEnd },
        RefundedProfit: { ...RefundedProfit },
        ellapsedDays: ellapsedDays(fixedDeposit),
        AnualRate: getAnualRate(fixedDeposit),
        state: status(fixedDeposit)
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Time deposit")} #${fixedDeposit.id}.pdf`)
    // 3. Append to html page
    document.body.appendChild(link)
    // 4. Force download
    link.click()
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link)
    setAltGeneratingPDF(false)
  }

  useEffect(() => {
    if (fixedDeposit !== null) {
      const controller = new AbortController();
      const signal = controller.signal;

      if (validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) {
        calculateProfitAtTheEnd(signal)
      } else {
        setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
      }
      if (validState(["Ongoing"])) { calculateActualProfit(signal) } else {
        setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
      }
      if (validState(["Closed (Out of term)", "Closed (Term completed)"])) {
        calculateRefundedProfit(signal)
      } else {
        setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: fixedDeposit.initialAmount } }))
      }

      return () => {
        controller.abort();
      };
    }
    //eslint-disable-next-line
  }, [fixedDeposit])

  useEffect(() => {
    if (ProfitAtTheEnd.fetched && ActualProfit.fetched && RefundedProfit.fetched && altGeneratingPDF) {
      renderAndDownloadFixedDepositPDF()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProfitAtTheEnd, ActualProfit, RefundedProfit])

  const getFixedDepositPDF = () => {
    setAltGeneratingPDF(true)
    if (fixedDeposit) {
      renderAndDownloadFixedDepositPDF()
    } else {
      axios.get(`/fixed-deposits/${content.fixedDepositId}`)
        .then((response) => {
          setFixedDeposit(response.data)
        }
        )
        .catch(
          (e) => {
            setAltGeneratingPDF(false)
            console.error(e)
          }
        )
    }

  }

  const incomingTransfer = (transfer) => transfer?.receiverId === AccountSelected?.id

  const renderAndDownloadTransferPDF = async (transfer) => {
    const blob = await ReactPDF.pdf(<TransferReceipt Transfer={{
      ...transfer, ...{
        state: t(getMoveStateById(transfer.stateId).name),
        accountAlias: AccountSelected.alias,
        incomingTransfer: incomingTransfer(transfer),
        AccountId: AccountSelected.id
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Transfer")} #${transfer.id}.pdf`)
    // 3. Append to html page
    document.body.appendChild(link)
    // 4. Force download
    link.click()
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link)
    setAltGeneratingPDF(false)
  }

  const getTransferPDF = () => {
    setAltGeneratingPDF(true)

    axios.get(`/transfers/${content.transferId}`, { params: { client: ClientSelected.id } })
      .then((response) => {
        renderAndDownloadTransferPDF(response.data)
      }
      )
      .catch(
        (e) => {
          setAltGeneratingPDF(false)
          console.error(e)
        }
      )
  }

  const renderAndDownloadTransactionPDF = async (transaction) => {
    const blob = await ReactPDF.pdf(<TransactionReceipt Transaction={{
      ...transaction, ...{
        state: t(getMoveStateById(transaction.stateId).name),
        accountAlias: AccountSelected.alias,
        fundName: content.fundName
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Transaction")} #${transaction.id}.pdf`)
    // 3. Append to html page
    document.body.appendChild(link)
    // 4. Force download
    link.click()
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link)
    setAltGeneratingPDF(false)
  }

  const getTransactionPDF = () => {
    setAltGeneratingPDF(true)

    axios.get(`/transactions/${content.transactionId}`)
      .then((response) => {
        renderAndDownloadTransactionPDF(response.data)
      }
      )
      .catch(
        (e) => {
          setAltGeneratingPDF(false)
          console.error(e)
        }
      )
  }

  const [showClick, setShowClick] = useState(false)
  const [showHover, setShowHover] = useState(false)

  const [ShowModal, setShowModal] = useState(false)
  const [Action, setAction] = useState("approve")

  const launchModalConfirmation = (action) => {
    setAction(action)
    setShowModal(true)
  }
  const isPerformanceMovement = (content.motive === "PENALTY_WITHDRAWAL" || content.motive === "PROFIT_DEPOSIT")

  const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
  const partialLiquidate = content?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")
  const clientNote = !isPerformanceMovement && content?.notes?.find(note => note.noteType === "CLIENT_NOTE")
  const noteFromAdmin = isPerformanceMovement && content?.notes?.find(note => note.noteType === "CLIENT_NOTE")
  const denialMotive = content?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
  const fundLiquidate = content?.notes?.find(note => note.noteType === "FUND_LIQUIDATE")

  const fund = useSelector(state => selectFundById(state, content.fundId))

  return (
    <tr>
      <td className="tableId text-nowrap" data-column-name="ticket">
        {content.id}
        {
          !!(content?.userEmail || content?.userName || !!(transferNote) || !!(clientNote) || !!(denialMotive) || !!(fundLiquidate) || !!(partialLiquidate)) &&
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
                {!!(content.userEmail || content?.userName) &&
                  <div>
                    {t('Operation performed by')}:<br />
                    <span className="text-nowrap">{(fundLiquidate || isPerformanceMovement) ? t("Administration") : content?.userName || content?.userEmail}</span>
                  </div>
                }
                {!!(transferNote) &&
                  <div>
                    {t('Transfer note')}:<br />
                    <span className="text-nowrap">"{transferNote.text}"</span>
                  </div>
                }
                {!!(clientNote) &&
                  <div>
                    {t('Personal note')}:<br />
                    <span className="text-nowrap">"{clientNote.text}"</span>
                  </div>
                }
                {!!(denialMotive) &&
                  <div>
                    {t('Denial motive')}:<br />
                    <span className="text-nowrap">"{denialMotive.text}"</span>
                  </div>
                }
                {
                  !!(partialLiquidate) &&
                  <div>
                    <span className="text-nowrap">"{partialLiquidate.text}"</span>
                  </div>
                }
                {
                  !!(fundLiquidate) &&
                  <div>
                    <span className="text-nowrap">"{fundLiquidate.text}"</span>
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
        {
          (
            ((content.fixedDepositId) && hasPermission("FIXED_DEPOSIT_VIEW")) ||
            ((content.transferId) && (hasPermission("TRANSFER_APPROVE") || hasPermission("TRANSFER_DENY") || hasPermission("TRANSFER_GENERATE"))) ||
            ((content.fundId) && (hasSellPermission(content.fundId) || hasBuyPermission(content.fundId)))
          ) ?
            <Dropdown className='d-inline' >
              <Dropdown.Toggle disabled={GeneratingPDF || altGeneratingPDF}
                as={CustomToggle} id="dropdown-custom-components">
                {
                  GeneratingPDF || altGeneratingPDF ?
                    <Spinner animation="border" size="sm" />
                    :
                    <>
                      <FontAwesomeIcon icon={faFilePdf} />
                    </>
                }
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => renderAndDownloadPDF()}>
                  {t("Movement receipt")}
                </Dropdown.Item>
                {
                  ((content.fixedDepositId) && hasPermission("FIXED_DEPOSIT_VIEW")) &&
                  <Dropdown.Item onClick={() => getFixedDepositPDF()}>
                    {t("Fixed deposit receipt")}
                  </Dropdown.Item>
                }
                {
                  ((content.transferId) && (hasPermission("TRANSFER_APPROVE") || hasPermission("TRANSFER_DENY") || hasPermission("TRANSFER_GENERATE"))) &&
                  <Dropdown.Item onClick={() => getTransferPDF()}>
                    {t("Transfer receipt")}
                  </Dropdown.Item>
                }
                {
                  ((content.fundId) && (hasSellPermission(content.fundId) || hasBuyPermission(content.fundId))) &&
                  <Dropdown.Item onClick={() => getTransactionPDF()}>
                    {t("Transaction receipt")}
                  </Dropdown.Item>
                }
              </Dropdown.Menu>
            </Dropdown>
            :
            <button disabled={GeneratingPDF} className="noStyle ps-1 pe-0" style={{ cursor: "pointer" }} onClick={() => renderAndDownloadPDF()}>
              {
                GeneratingPDF ?
                  <Spinner animation="border" size="sm" />
                  :
                  <FontAwesomeIcon icon={faFilePdf} />
              }
            </button>
        }
      </td>
      <td className="tableDate">
        {momentDate.format('L')}
      </td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>
        {t(getMoveStateById(content.stateId).name)}
        {(content?.transfer?.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
      </td>
      <td className="tableConcept">
        {
          (!content?.transferReceiver && !content?.transferSender) &&
          (
            fundLiquidate ?
              <>{t("Fund liquidation")} {content.fundName}</>
              :
              isPerformanceMovement ? <>{t(content.motive)} ({noteFromAdmin ? noteFromAdmin?.text : t(content.motive === "PENALTY_WITHDRAWAL" ? "penalty" : "bonification")})</>
                :
                t(content.motive + (content.motive === "REPAYMENT" ? content.fundName ? "_" + content.fundName : "_" + content.fixedDepositId : ""), { fund: content.fundName, fixedDeposit: content.fixedDepositId })
          )
        }
        {content?.transferReceiver && <>{t("Transfer to {{transferReceiver}}", { transferReceiver: content?.transferReceiver })}</>}
        {content?.transferSender && <>{t("Transfer from {{transferSender}}", { transferSender: content?.transferSender })}</>}
        {(content?.transfer?.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""}
        {
          !!(partialLiquidate) && <> ({t("Partial liquidation")})</>
        }
      </td>
      <td className={`tableAmount ${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>
        <span>{Math.sign(content.amount) === 1 ? '+' : '-'}</span>
        <FormattedNumber value={Math.abs(content.amount)} prefix="U$D " fixedDecimals={2} />
      </td>
      <td className={`tableAmount `}>
        {
          content.partialBalance ?
            <FormattedNumber value={Math.abs(content.partialBalance)} prefix="U$D " fixedDecimals={2} />
            :
            <>-</>
        }
      </td>
      {
        !!(actions) &&
        <td className={`Actions verticalCenter ${fund?.disabled ? "disabled" : ""}`} data-column-name="actions" >
          {
            !!(content.stateId === 5) &&
            <div className="h-100 d-flex align-items-center justify-content-around">

              <div className={`iconContainer green ${!couldSign(content) ? "not-allowed" : ""}`}>
                <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { if (couldSign(content)) { launchModalConfirmation("approve") } }} />
              </div>

              <div className={`iconContainer red ${!couldSign(content) ? "not-allowed" : ""}`}>
                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { if (couldSign(content)) { launchModalConfirmation("deny") } }} />
              </div>

            </div>
          }
          {
            !!((content.stateId === 1
              &&
              (
                ((hasPermission("TRANSFER_DENY") || hasPermission("TRANSFER_APPROVE")) && content.motive === "TRANSFER_RECEIVE")
                ||
                (hasPermission("TRANSFER_DENY") && content.motive === "TRANSFER_SEND")
              )
            )) &&
            <div className="h-100 d-flex align-items-center justify-content-around">
              {
                !!(content.motive === "TRANSFER_RECEIVE") &&
                <>
                  {
                    hasPermission("TRANSFER_APPROVE") &&
                    <div className="iconContainer green">
                      <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => launchModalConfirmation("approve")} />
                    </div>
                  }
                </>
              }

              {
                hasPermission("TRANSFER_DENY") &&
                <div className="iconContainer red">
                  <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => launchModalConfirmation("deny")} />
                </div>
              }
            </div>
          }
        </td>

      }
      {
        !!(content.stateId === 5 && couldSign(content)) &&
        <MovementConfirmation reloadData={reloadData} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
      }
      {
        !!((content.stateId === 1
          &&
          (
            ((hasPermission("TRANSFER_DENY") || hasPermission("TRANSFER_APPROVE")) && content.motive === "TRANSFER_RECEIVE")
            ||
            (hasPermission("TRANSFER_DENY") && content.motive === "TRANSFER_SEND")
          )
        )) &&
        <ActionConfirmationModal isMovement reloadData={reloadData} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
      }
    </tr>
  )
}
export default Movement
