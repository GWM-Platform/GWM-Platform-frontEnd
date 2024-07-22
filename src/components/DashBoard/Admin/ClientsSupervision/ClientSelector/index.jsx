import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button } from 'react-bootstrap'
import ClientsSearch from './ClientsSearch'
import ClientsTable from './ClientsTable'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const ClientSelector = ({ Clients }) => {
    const { t } = useTranslation();

    const [FilteredClients, setFilteredClients] = useState(Clients.sort((a, b) => a.alias.localeCompare(b.alias)))
    const [SearchText, setSearchText] = useState("")

    const handleSearch = (event) => {
        setSearchText(event.target.value)
    }

    const cancelSearch = () => {
        setSearchText("")
        setFilteredClients(Clients)
    }

    const search = () => {
        const regex = new RegExp(`${SearchText}`, 'i')
        const suggestions = Clients.sort().filter(Clients => Clients.id.toString().match(regex) || Clients.alias.match(regex))
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


