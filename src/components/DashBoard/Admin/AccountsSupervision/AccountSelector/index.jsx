import React, {  useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Col } from 'react-bootstrap'
import AccountsSearch from './AccountsSearch'
import AccountsTable from './AccountsTable'
import NoAccounts from './NoAccounts'

const AccountSelector = ({ Accounts, Clients,setSelectedAccountId }) => {


    const [FilteredAccounts, setFilteredAccounts] = useState(Accounts)
    const [SearchText, setSearchText] = useState("")

    const handleSearch = (event) => {
        setSearchText(event.target.value)
        const regex = new RegExp(`${event.target.value}`, 'i')
        const suggestions = Accounts.sort().filter(Accounts => Accounts.id.toString().match(regex))
        setFilteredAccounts(suggestions)
    }

    const cancelSearch = () => {
        setSearchText("")
        setFilteredAccounts(Accounts)
    }

    return (
        <Col>
            <AccountsSearch
                handleSearch={handleSearch}
                SearchText={SearchText}
                cancelSearch={cancelSearch}
                FilteredAccounts={FilteredAccounts}
            />
            {
                FilteredAccounts.length === 0 && SearchText.length>0 ?
                    <NoAccounts /> :
                    <AccountsTable setSelectedAccountId={setSelectedAccountId} Clients={Clients} FilteredAccounts={FilteredAccounts}/>
            }
        </Col>
    )
}
export default AccountSelector


