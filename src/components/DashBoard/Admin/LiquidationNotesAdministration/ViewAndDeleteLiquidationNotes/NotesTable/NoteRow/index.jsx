import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { customFetch } from 'utils/customFetch';

const NoteRow = ({ Note, chargeNotes, setAction, Action, ownKey }) => {
    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)

    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }

    return (
        <>
            <tr className="noteRow">
                <td className="Id">{Note.id}</td>
                <td className="Name">{Note.nombre}</td>
                <td className="Actions text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <button 
                            className="noStyle iconContainer red" 
                            onClick={() => { launchDeleteConfirmation() }}
                            title={t("Delete")}
                        >
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </button>
                        <button 
                            className="noStyle iconContainer blue" 
                            onClick={() => setAction({ ...Action, ...{ action: 0, note: ownKey } })}
                            title={t("Edit")}
                        >
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </button>
                    </div>
                </td>
            </tr>
            <DeleteConfirmationModal 
                show={ShowModal} 
                setShowModal={setShowModal} 
                Note={Note} 
                chargeNotes={chargeNotes} 
            />
        </>
    )
}
export default NoteRow

