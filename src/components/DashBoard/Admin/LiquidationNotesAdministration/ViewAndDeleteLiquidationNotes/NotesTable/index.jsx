import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from 'react-bootstrap'
import NoteRow from './NoteRow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

const NotesTable = ({ Notes, chargeNotes, setAction, Action }) => {
    const { t } = useTranslation()

    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <Button 
                    variant="success" 
                    onClick={() => setAction({ ...Action, ...{ action: 1, note: -1 } })}
                >
                    <FontAwesomeIcon className="me-2" icon={faPlus} />
                    {t("Add liquidation option")}
                </Button>
            </div>
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
            </Table>
        </div>
    )
}

export default NotesTable

