import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap'
import NoteRow from './NoteRow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

const NotesTable = ({ Notes, chargeNotes, setAction, Action }) => {
    const { t } = useTranslation()

    return (
        <div className="notes-table">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>{t("ID")}</th>
                        <th>{t("Name")}</th>
                        <th className="text-center">{t("Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {Notes.map((Note, index) => (
                        <NoteRow
                            key={Note.id}
                            Note={Note}
                            chargeNotes={chargeNotes}
                            setAction={setAction}
                            Action={Action}
                            ownKey={index}
                        />
                    ))}
                </tbody>
                <tfoot>
                    <tr className="noteRow add">
                        <td className="border-0 p-0" colSpan="2" />
                        <td className="Actions text-center">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <div className="iconContainer green">
                                    <button
                                        className="noStyle"
                                        onClick={() => setAction({ ...Action, ...{ action: 1, note: -1 } })}
                                        title={t("Add liquidation option")}
                                    >
                                        <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}

export default NotesTable

