import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronRight } from '@fortawesome/free-solid-svg-icons'

const AccountRow = ({ Account, Client,setSelectedAccountId }) => {

    const { t } = useTranslation();

    const [balanceTotal, setBalanceTotal] = useState({ fetching: true, fetched: true, value: 0 })

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getBalance = async () => {
            setBalanceTotal((prevState) => ({ fetching: true, fetched: true, value: 0 }))
            var url = `${process.env.REACT_APP_APIURL}/clients/${Client.id}/balance`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setBalanceTotal((prevState) => ({...prevState,...{ fetching: false, fetched: false ,value:dataFetched}}))
            } else {
                switch (response.status) {
                    case 500:
                        setBalanceTotal((prevState) => ({...prevState,...{ fetching: false, fetched: false }}))
                        break;
                    default:
                        setBalanceTotal((prevState) => ({...prevState,...{ fetching: false, fetched: false }}))
                        console.error(response.status)
                }
            }
        }
        getBalance()

    }, [Client])

    return (
        <tr className="AccountRow">
            <td className="Id">{t(Account.id)}</td>
            <td className="Alias">{t(Client.alias)}</td>
            <td className="Alias">
                {
                    balanceTotal.fetching ?
                        <Spinner animation="border" size="sm" />
                        :
                        "$"+balanceTotal.value
                }
            </td>
            <td onClick={()=>setSelectedAccountId(Account.id)} className="toDetails">{t("Go to details")}<FontAwesomeIcon className="chevron" icon={faChevronRight}/></td>
        </tr>
    )
}
export default AccountRow

