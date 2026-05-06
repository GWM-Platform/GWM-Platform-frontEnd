import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button } from 'react-bootstrap'
import ClientsSearch from './ClientsSearch'
import ClientsTable from './ClientsTable'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const ClientSelector = ({ Clients }) => {
    const { t } = useTranslation();

    const sortedClients = useMemo(
        () => [...(Clients || [])].sort((a, b) => (a?.alias || '').localeCompare(b?.alias || '')),
        [Clients]
    )
    const [FilteredClients, setFilteredClients] = useState(sortedClients)
    const [SearchText, setSearchText] = useState("")

    useEffect(() => {
        setFilteredClients(sortedClients)
    }, [sortedClients])

    const handleSearch = (event) => {
        setSearchText(event.target.value)
    }

    const cancelSearch = () => {
        setSearchText("")
        setFilteredClients(sortedClients)
    }

    const search = () => {
        const escapedSearch = SearchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`${escapedSearch}`, 'i')
        const suggestions = sortedClients.filter(client => client.id.toString().match(regex) || (client.alias || '').match(regex))
        setFilteredClients(suggestions)
    }
    const history = useHistory()

    return (
        <Col className="section growOpacity">
            <div className="header d-flex">
                <h1 className="title fw-normal">{t("Clients supervision")}</h1>
                <Button className="ms-auto" onClick={() => history.push("/DashBoard/clientsSupervision/create-client")}>
                    {t("Create client")}
                </Button>
            </div>
            <ClientsSearch
                handleSearch={handleSearch}
                SearchText={SearchText}
                cancelSearch={cancelSearch}
                Clients={Clients}
                FilteredClients={FilteredClients}
                search={search}
            />
            <ClientsTable FilteredClients={FilteredClients} />
        </Col>
    )
}
export default ClientSelector


