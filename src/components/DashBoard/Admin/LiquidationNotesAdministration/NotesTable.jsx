import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Form, Table, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import EmptyTable from "components/DashBoard/GeneralUse/EmptyTable";
import { ContextAwareToggle } from '../Operations/OperationsTable';
import { NoteRow } from './NoteRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import ClientsSearch from '../ClientsSupervision/ClientSelector/ClientsSearch';
import { customFetch } from 'utils/customFetch';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

export const NotesTable = () => {
    const { t } = useTranslation();
    const { token } = useContext(DashBoardContext)
    const history = useHistory()

    const [FetchingNotes, setFetchingNotes] = useState(true)
    const [Notes, setNotes] = useState([])

    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const sortData = (field) => {
        if (sortField === field && sortDirection === 'desc') {
            setSortField(null);
            setSortDirection('asc');
        }
        else {
            let direction = 'asc';
            if (sortField === field && sortDirection === 'asc') {
                direction = 'desc';
            }
            setSortField(field);
            setSortDirection(direction);
        }
    };

    const [search, setSearch] = useState("")

    const getNotes = async () => {
        setFetchingNotes(true)
        var url = `${process.env.REACT_APP_APIURL}/liquidation-notes`;

        const response = await customFetch(url, {
            method: 'GET',
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setNotes(data)
            setFetchingNotes(false)
        } else {
            console.error(response.status)
            setFetchingNotes(false)
        }
    }

    useEffect(() => {
        getNotes()
        //eslint-disable-next-line
    }, [])

    const notesSorted = useMemo(() => [...Notes]
        .filter(note => {
            if (search === "") {
                return true
            }
            const searchLower = search.toLowerCase()
            return note.nombre?.toLowerCase().includes(searchLower)
        }).sort((a, b) => {
            if (sortField) {
                const aValue = a[sortField] || ""
                const bValue = b[sortField] || ""
                if (aValue === "" || aValue === "-") return (bValue === "" || bValue === "-") ? 1 : (sortDirection === 'asc' ? 1 : -1)
                if (bValue === "" || bValue === "-") return (aValue === "" || aValue === "-") ? -1 : (sortDirection === 'asc' ? -1 : +1)
                if (typeof aValue === 'string') {
                    return sortDirection === 'asc' ? (aValue).localeCompare(bValue) : (bValue).localeCompare(aValue);
                } else {
                    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }
            }
            return 0;
        }), [Notes, search, sortDirection, sortField])

    const chargeNotes = () => {
        getNotes()
    }

    return (
        <Col className="section growOpacity h-100 d-flex flex-column">
            <Accordion style={{ borderBottom: "1px solid #b3b3b3", marginTop: "0.5em", fontSize: "2rem" }} >
                <ContextAwareToggle 
                    buttonText="Add liquidation option" 
                    eventKey="0" 
                    create={() => history.push("/DashBoard/liquidationNotesAdministration/creation")}
                >
                    {t("Liquidation options administration")}
                </ContextAwareToggle>
                <Accordion.Collapse eventKey="0">
                    <Form noValidate>
                        <Row className="pt-2 g-2">
                            <div className="w-100 m-0 mb-2" />
                        </Row>
                    </Form>
                </Accordion.Collapse>
            </Accordion>
            <ClientsSearch
                handleSearch={(e) => setSearch(e.target.value)}
                SearchText={search}
                cancelSearch={() => setSearch("")}
                FilteredClients={notesSorted}
                Clients={Notes}
                label={"Search"}
            />
            {
                Notes?.length === 0 ?
                    FetchingNotes ?
                        <Loading className="h-100 mb-5" />
                        :
                        <EmptyTable className="h-100 mb-5" />
                    :
                    <div className="py-3 w-100">
                        <div className="w-100 overflow-auto">
                            <Table className="ClientsTable mb-0" striped bordered hover>
                                <thead className="verticalTop tableHeader solid-bg">
                                    <tr>
                                        <th className="Alias" onClick={() => sortData('nombre')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Name")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "nombre" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="Balance"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notesSorted.map(note => <NoteRow key={note.id} note={note} chargeNotes={chargeNotes} />)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
            }
        </Col>
    )
}

