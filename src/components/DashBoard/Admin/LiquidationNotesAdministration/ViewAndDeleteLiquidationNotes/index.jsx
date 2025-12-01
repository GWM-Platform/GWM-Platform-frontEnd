import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import NotesTable from './NotesTable'
import NotesSearch from './NotesSearch'
import NoNotes from './NoNotes'
import { useTranslation } from 'react-i18next';

const ViewAndDeleteLiquidationNotes = ({ Notes, SearchText, handleSearch, cancelSearch, FilteredNotes, chargeNotes, setAction, Action }) => {
    const { t } = useTranslation()

    return (
        <Col sm="12" className="ViewAndDeleteLiquidationNotes">
            <div className="header-with-border">
                <h1 className="title">{t("Liquidation options administration")}</h1>
            </div>
            {Notes.length > 0 ?
                <>
                    <NotesSearch
                        FilteredNotes={FilteredNotes} 
                        SearchText={SearchText} 
                        handleSearch={handleSearch} 
                        cancelSearch={cancelSearch} 
                    />
                    {
                        FilteredNotes.length === 0 && SearchText.length > 0 ?
                            <NoNotes motive={0} /> :
                            <NotesTable 
                                Notes={FilteredNotes} 
                                chargeNotes={chargeNotes} 
                                Action={Action} 
                                setAction={setAction} 
                            />
                    }
                </>
                :
                <NoNotes motive={0} />
            }
        </Col>
    )
}

export default ViewAndDeleteLiquidationNotes

