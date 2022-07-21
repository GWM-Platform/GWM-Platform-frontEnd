import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const RuleRow = ({ rule, ActionDispatch, FixedDeposit, getFixedDepositPlans }) => {

    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)

    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }
    return (
        <>
            <tr className="fundRow">
                <td >{t(rule.days)}</td>
                <td >
                    <FormattedNumber value={rule?.rate} suffix="%" fixedDecimals={2} />
                </td>
                <td className="Actions verticalCenter" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <button className="noStyle iconContainer red" onClick={() => { launchDeleteConfirmation() }}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </button>
                        <button className="noStyle iconContainer  green" onClick={() => ActionDispatch({ type: "edit", ruleDays: rule.days })}>
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </button>
                    </div>
                </td>
            </tr>
            <DeleteConfirmationModal FixedDeposit={FixedDeposit} rule={rule.days} show={ShowModal} setShowModal={setShowModal} getFixedDepositPlans={getFixedDepositPlans} />
        </>
    )
}
export default RuleRow

