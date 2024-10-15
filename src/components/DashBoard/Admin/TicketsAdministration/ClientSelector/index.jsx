import React, { useCallback, useContext, useEffect, useState } from "react";
import BaseSelect from "react-select";
import FixRequiredSelect from 'components/DashBoard/GeneralUse/Forms/FixRequiredSelect';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { DashBoardContext } from "context/DashBoardContext";
import { Form } from "react-bootstrap";

const ClientSelector = ({ client, setClient }) => {
    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext)

    const [clients, setClients] = useState({ fetching: true, fetched: false, valid: false, content: [] })

    const getClients = useCallback((signal) => {
        setClients((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/clients`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setClients((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setClients((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setClients]);


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getClients(signal)

        return () => {
            controller.abort();
        };
    }, [getClients])

    const Select = props => (
        <FixRequiredSelect
            {...props}
            SelectComponent={BaseSelect}
            options={props.options}
        />
    );

    return (
        <Form.Group className="mb-3 mt-2">
            <Form.Label>{t("Client")}</Form.Label>
            <Select
                classNamePrefix="react-select"
                alwaysDisplayPlaceholder
                isClearable required value={Object.keys(client || {}).length === 0 ? "" : client} placeholder={t("Client")} noOptionsMessage={() => t('No clients found')}
                onChange={(val) => { setClient({ ...val }) }}
                options={clients.content.map((client, key) => (
                    {
                        label: `${t("Number")}: ${client.id} / ${t("Alias")}: ${client.alias} / ${t("First name")}: ${client.firstName} ${t("Last name")}: ${client.lastName}`,
                        value: client.id
                    }
                ))}
            />
        </Form.Group>
    );
}

export default ClientSelector