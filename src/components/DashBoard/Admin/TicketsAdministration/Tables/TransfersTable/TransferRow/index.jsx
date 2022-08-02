import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const TransferRow = ({ AccountInfo, UsersInfo, Movement, state, reloadData }) => {

    var momentDate = moment(Movement.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    return (
        <>
            <tr className="transactionRow">
                <td>
                    <span className='text-nowrap'>
                        {
                            Movement?.senderAlias
                        }
                    </span>
                </td>
                <td>
                    <span className='text-nowrap'>
                        {
                            Movement?.receiverAlias
                        }
                    </span>
                </td>
                <td>
                    <FormattedNumber value={Movement.amount} prefix="$" fixedDecimals={2} />
                </td>
                <td>
                    <span className='text-nowrap'>
                        {momentDate.format('L')}
                    </span>
                </td>
                <td>{Movement.id}</td>
                {
                    !!(Movement.stateId === 1 && false) &&
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
            </tr>
            {
                Movement.stateId === 1 ?
                    <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null}
        </>
    )
}
export default TransferRow

