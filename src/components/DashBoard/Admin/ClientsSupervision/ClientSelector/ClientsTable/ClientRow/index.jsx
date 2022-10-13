import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { Link } from 'react-router-dom';

const ClientRow = ({ Client, show }) => {

    const { t } = useTranslation();

    const [balanceTotal, setBalanceTotal] = useState({ fetching: true, fetched: true, value: 0 })

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getBalance = async () => {
            setBalanceTotal((prevState) => ({ ...prevState, fetching: true, fetched: true, value: 0 }))
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
                setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false, value: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }
        getBalance()

    }, [Client])

    return (
        <tr className={`ClientRow ${show ? '' : 'd-none'}`}>
            <td className="Id">{Client.id}</td>
            <td className="Alias">{Client.alias}</td>
            <td className="Alias">
                {
                    balanceTotal.fetching ?
                        <Spinner animation="border" size="sm" />
                        :
                        <FormattedNumber value={balanceTotal.value} prefix="$" fixedDecimals={2} />
                }
            </td>
            <td className="toDetails text-nowrap">
                <Link to={`/DashBoard/clientsSupervision/${Client.id}`}>
                    <span className="d-inline d-md-none">{t("Details")}</span>
                    <span className="d-none d-md-inline">{t("Go to details")}</span>
                    <FontAwesomeIcon className="chevron" icon={faChevronRight} />
                </Link>
            </td>
        </tr>
    )
}
export default ClientRow

