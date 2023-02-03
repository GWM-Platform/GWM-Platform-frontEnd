import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button } from 'react-bootstrap'
import ClientsSearch from './ClientsSearch'
import ClientsTable from './ClientsTable'
import NoAccounts from './NoAccounts'
import { useTranslation } from 'react-i18next';
import {  useHistory } from 'react-router-dom';

const ClientSelector = ({ Accounts, Clients }) => {

    const { t } = useTranslation();

    const [FilteredClients, setFilteredClients] = useState(Clients)
    const [SearchText, setSearchText] = useState("")

    const handleSearch = (event) => {
        setSearchText(event.target.value)
        const regex = new RegExp(`${event.target.value}`, 'i')
        const suggestions = Clients.sort().filter(Clients => Clients.id.toString().match(regex) || Clients.alias.match(regex))
        setFilteredClients(suggestions)
    }

    const cancelSearch = () => {
        setSearchText("")
        setFilteredClients(Accounts)
    }
    const history = useHistory()

    return (
        <Col className="section growOpacity">
            <div className="header d-flex">
                <h1 className="title">{t("Clients supervision")}</h1>
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
            />
            {
                FilteredClients.length === 0 && SearchText.length > 0 ?
                    <NoAccounts /> :
                    <ClientsTable Clients={Clients} FilteredClients={FilteredClients} />
            }
        </Col>
    )
}
export default ClientSelector


