import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import Decimal from 'decimal.js';

const RuleRow = ({ rule, ActionDispatch}) => {

    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)

    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }
    return (
        <>
            <tr className="fundRow">
                <td >{t(rule.days)}</td>
                <td >{new Decimal(rule?.rate || 0).toString()}%</td>
                <td className="Actions verticalCenter" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <button className="noStyle iconContainer red" onClick={() => { launchDeleteConfirmation() }}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </button>
                        <button className="noStyle iconContainer  green" onClick={() => ActionDispatch({ type: "edit", ruleId: rule.id })}>
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </button>
                    </div>
                </td>
            </tr>
            <DeleteConfirmationModal show={ShowModal} setShowModal={setShowModal}/>
        </>
    )
}
export default RuleRow

