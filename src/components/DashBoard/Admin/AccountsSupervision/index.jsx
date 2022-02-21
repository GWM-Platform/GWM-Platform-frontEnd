import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import Loading from '../../User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import AccountSelector from './AccountSelector';
import SelectedAccountData from './AccountSelector/SelectedAccountData';

const AccountsSupervision = () => {
    const [Accounts, setAccounts] = useState({ fetching: true, fetched: false, content: [] })
    const [Clients, setClients] = useState({ fetching: true, fetched: false, content: [] })
    const [Movements, setMovements] = useState({ fetching: true, fetched: false, content: [] })
    const [stakes, setStakes] = useState({ fetching: true, fetched: false, content: [] })
    const [Transactions, setTransactions] = useState({ fetching: true, fetched: false, content: [] })
    const [SelectedAccountId, setSelectedAccountId] = useState(false)

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getAccounts = async () => {
            setAccounts((prevState) => ({ fetching: true, fetched: true, content: [] }))
            var url = `${process.env.REACT_APP_APIURL}/Accounts`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setAccounts((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setAccounts((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setAccounts((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }
        const getClients = async () => {
            setClients((prevState) => ({ fetching: true, fetched: true, content: [] }))
            var url = `${process.env.REACT_APP_APIURL}/Clients/?` + new URLSearchParams({
                all:true,
            });
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setClients((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setClients((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setClients((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }
        getAccounts()
        getClients()

    }, [])

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getTransactions = async () => {
            setTransactions((prevState) => ({ fetching: true, fetched: true, content: [] }))
            var url = `${process.env.REACT_APP_APIURL}/transactions/`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setTransactions((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setTransactions((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setTransactions((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }

        const getMovements = async () => {
            setMovements((prevState) => ({ fetching: true, fetched: true, content: [] }))
            var url = `${process.env.REACT_APP_APIURL}/movements/`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setMovements((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setMovements((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setMovements((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }

        const getStakes = async () => {
            setStakes((prevState) => ({ fetching: true, fetched: true, content: [] }))
            var url = `${process.env.REACT_APP_APIURL}/stakes`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setStakes((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setStakes((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setStakes((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }

        if (!Accounts.fetching && !Clients.fetching) {
            getStakes()
            getMovements()
            getTransactions()
        }
    }, [Accounts, Clients])


    const getClientByClientId = (searchedId) => {

        let index = Clients.content.findIndex((client) => client.id === searchedId)
        return index === -1 ? false : Clients.content[index]
    }

    const getAccountByAccountId = (searchedId) => {
        let index = Accounts.content.findIndex((account) => account.id === searchedId)
        return index === -1 ? false : Accounts.content[index]
    }

    return (
        <Container className="h-100 AccountsSupervision">
            <Row className="h-100">
                {Accounts.fetching || Clients.fetching || Movements.fetching || stakes.fetching || Transactions.fetching ?
                    <Loading />
                    :
                    SelectedAccountId ?
                        <SelectedAccountData
                            Movements={Movements.content} stakes={stakes.content} Transactions={Transactions.content}
                            Client={getClientByClientId(getAccountByAccountId(SelectedAccountId).clientId)}
                            SelectedAccountId={SelectedAccountId} setSelectedAccountId={setSelectedAccountId}
                            Account={getAccountByAccountId(SelectedAccountId)}
                        />
                        :
                        <AccountSelector setSelectedAccountId={setSelectedAccountId} Accounts={Accounts.content} Clients={Clients.content} />
                }
            </Row>
        </Container>

    )
}
export default AccountsSupervision


