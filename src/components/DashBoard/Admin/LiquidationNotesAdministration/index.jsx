import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import Loading from 'components/DashBoard/Admin/Loading'
import Error from 'components/DashBoard/Admin/Error';
import ViewAndDeleteLiquidationNotes from './ViewAndDeleteLiquidationNotes';
import CreateLiquidationNotes from './CreateLiquidationNotes';
import EditLiquidationNotes from './EditLiquidationNotes';
import { DashBoardContext } from 'context/DashBoardContext';
import { customFetch } from 'utils/customFetch';

const LiquidationNotesAdministration = () => {
    const { toLogin, token } = useContext(DashBoardContext)
    const [Notes, setNotes] = useState({ fetching: true, fetched: false, valid: false, content: [] })
    const [Action, setAction] = useState({ action: -1, note: -1 }) // -1 view, 0 edit, 1 create
    const [search, setSearch] = useState("")

    const chargeNotes = useCallback(async () => {
        setNotes(prev => ({ ...prev, fetching: true }))

        const url = `${process.env.REACT_APP_APIURL}/liquidation-notes`;
        const response = await customFetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setNotes({ fetching: false, fetched: true, valid: true, content: data })
        } else {
            if (response.status === 401) toLogin()
            setNotes(prev => ({ ...prev, fetching: false, fetched: true, valid: false }))
        }
    }, [toLogin, token])

    useEffect(() => {
        chargeNotes()
    }, [chargeNotes])

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const filteredNotes = useMemo(() => {
        const searchLower = search.toLowerCase()
        return Notes.content.filter(note => note.nombre?.toLowerCase().includes(searchLower))
    }, [Notes.content, search])

    if (Notes.fetching) {
        return <Loading />
    }

    if (!Notes.valid) {
        return <Error />
    }

    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                {
                    {
                        "-1":
                            <ViewAndDeleteLiquidationNotes
                                Notes={Notes.content}
                                SearchText={search}
                                handleSearch={handleSearch}
                                cancelSearch={() => setSearch("")}
                                FilteredNotes={filteredNotes}
                                chargeNotes={chargeNotes}
                                setAction={setAction}
                                Action={Action}
                            />,
                        0:
                            <EditLiquidationNotes
                                Notes={Notes.content}
                                chargeNotes={chargeNotes}
                                Action={Action}
                                setAction={setAction}
                            />,
                        1:
                            <CreateLiquidationNotes
                                Notes={Notes.content}
                                chargeNotes={chargeNotes}
                                Action={Action}
                                setAction={setAction}
                            />
                    }[Action.action]
                }
            </Row>
        </Container>
    )
}
export default LiquidationNotesAdministration
