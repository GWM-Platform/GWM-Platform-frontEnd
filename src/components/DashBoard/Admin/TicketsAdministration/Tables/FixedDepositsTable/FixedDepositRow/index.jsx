import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import ActionConfirmationModal from './ActionConfirmationModal'
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';

const FixedDepositRow = ({ AccountInfo, UsersInfo, Movement, state, reloadData }) => {
    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext);


    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [UserTicketInfo, SetUserTicketInfo] = useState({ fetching: true, valid: false, value: {} })
    const [profit, setProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    useEffect(() => {
        const userInfoById = (clientId) => {
            let indexClientTransaction = UsersInfo.value.findIndex((client) => client.id === clientId)
            if (indexClientTransaction >= 0) {
                SetUserTicketInfo((prevState) => ({
                    ...prevState,
                    valid: true,
                    fetching: false,
                    value: UsersInfo.value[indexClientTransaction]
                }))
            } else {
                SetUserTicketInfo((prevState) => ({
                    ...prevState,
                    valid: false,
                    fetching: false,
                }))
            }
        }

        const calculateProfit = () => {
            axios.post(`/fixed-deposits/profit`,
                {
                    initialAmount: Movement?.initialAmount,
                    interestRate: Movement?.interestRate,
                    duration: Movement?.duration,
                }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || 0 } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: 0 } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: 0 } }))
                    }
                });
        }

        if (!UsersInfo.fetching) {
            userInfoById(Movement.clientId)
        }
        if (!profit.fetching) {
            calculateProfit()
        }
        //eslint-disable-next-line
    }, [Movement, UsersInfo])

    return (
        <>
            <tr className="transactionRow">
                <td>
                    <span className='text-nowrap'>
                        {
                            UserTicketInfo.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                UserTicketInfo.valid ?
                                    UserTicketInfo.value.alias
                                    :
                                    t("Undefined Client")
                        }
                    </span>
                </td>
                <td>
                    <span className='text-nowrap'>
                        ${
                            Movement?.initialAmount
                        }
                    </span>
                </td>
                <td>
                    <span className='text-nowrap'>
                        {Movement?.duration}&nbsp;{t("days")}
                    </span>
                </td>
                <td>
                    <span className='text-nowrap'>
                        {
                            profit.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                profit.valid ?
                                    "$" + profit.value
                                    :
                                    t("Undefined Profit")
                        }
                    </span>
                </td>
                {
                    !!(Movement.stateId===2) &&
                    <td>
                        {t(Movement.closed ? "Closed" : "Opened")}
                    </td>
                }
                <td>
                    {Movement?.id}
                </td>
                {
                    !!(Movement.stateId === 1) &&
                    <td className="Actions verticalCenter" >
                        <div className="h-100 d-flex align-items-center justify-content-around">
                            <div className="iconContainer green">
                                <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                            </div>
                            <div className="iconContainer red">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                            </div>
                        </div>
                    </td>
                }
                {
                    !!(Movement.stateId === 2 && !Movement.closed) &&
                    <td className="Actions verticalCenter" >
                        <div className="h-100 d-flex align-items-center justify-content-around">

                            <div className="iconContainer red">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("close") }} />
                            </div>
                        </div>
                    </td>
                }
            </tr>
            {
                Movement.stateId === 1 || (Movement.stateId === 2 && !Movement.closed) ?
                    <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null}
        </>
    )
}
export default FixedDepositRow

