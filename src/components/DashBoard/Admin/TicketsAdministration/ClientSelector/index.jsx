import React, { useEffect, useMemo } from "react";
import BaseSelect from "react-select";
import FixRequiredSelect from 'components/DashBoard/GeneralUse/Forms/FixRequiredSelect';
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import MultiSelectById from "../MultiSelectById";
import { useDispatch, useSelector } from "react-redux";
import { fetchclients, selectAllclients } from "Slices/DashboardUtilities/clientsSlice";

const ClientSelector = ({ client, setClient }) => {
    const { t } = useTranslation();
    const clientsState = useSelector(state => state.clients.status)
    const clients = useSelector(selectAllclients)

    const dispatch = useDispatch()
    useEffect(() => {
        if (clientsState === 'idle') {
            dispatch(fetchclients())
        }
    }, [clientsState, dispatch])

    const options = useMemo(() => clients.map((client) => ({
        value: client.id,
        label: `${client.id} - ${(client.firstName || client.lastName)
            ? `${client.firstName || ""}${client.firstName && client.lastName ? " " : ""}${client.lastName || ""}`
            : client.alias}`
    })), [clients]);

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
                options={options}
            />
        </Form.Group>
    );
}

export default ClientSelector

export const ClientsSelector = ({
    handleChange,
    FormData
}) => {

    const clientsState = useSelector(state => state.clients.status)
    const clients = useSelector(selectAllclients)

    const dispatch = useDispatch()
    useEffect(() => {
        if (clientsState === 'idle') {
            dispatch(fetchclients())
        }
    }, [clientsState, dispatch])

    const { t } = useTranslation()
    const options = useMemo(() => clients.map((client) => ({
        value: client.id,
        label: `${client.id} - ${(client.firstName || client.lastName)
            ? `${client.firstName || ""}${client.firstName && client.lastName ? " " : ""}${client.lastName || ""}`
            : client.alias}`
    })), [clients]);

    return (
        <Form.Group className="mb-3 mt-2">
            <Form.Label>
                {t("Clients")}

            </Form.Label>
            <MultiSelectById
                placeholder={t('All')}
                options={options}
                FormData={FormData}
                isClearable
                id="clients"
                handleChange={handleChange}
            />
        </Form.Group>
    )
}