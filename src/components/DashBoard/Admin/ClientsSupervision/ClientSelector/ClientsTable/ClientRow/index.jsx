import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClientRow = ({ Client, show }) => {

    const { t } = useTranslation();

    const [balanceTotal, setBalanceTotal] = useState({ fetching: true, fetched: true, value: 0 })

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        // check alias
        setBalanceTotal((prevState) => ({ ...prevState, fetching: true, fetched: true, value: 0 }))
        axios.get(`${process.env.REACT_APP_APIURL}/clients/${Client.id}/balance`, { signal: signal })
            .then(function (response) {
                setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false, value: response.data } }))
            }).catch((err) => {
                if (err.message !== 'canceled') {
                    setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                }
            })

        return () => {
            controller.abort();
        };
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
                        <FormattedNumber value={balanceTotal.value} prefix="U$D " fixedDecimals={2} />
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

