import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export const NoteRow = ({ note, chargeNotes }) => {
    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)
    const history = useHistory()

    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }

    const editNote = () => {
        history.push(`/DashBoard/liquidationNotesAdministration/edit/${note.id}`)
    }

    return (
        <>
            <tr>
                <td className="Alias">{note?.nombre}</td>
                <td className="Actions verticalCenter">
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <button 
                            className="noStyle iconContainer red" 
                            onClick={() => { launchDeleteConfirmation() }}
                            title={t("Delete")}
                        >
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </button>
                        <button 
                            className="noStyle iconContainer blue" 
                            onClick={editNote}
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
                Note={note} 
                chargeNotes={chargeNotes} 
            />
        </>
    );
}
