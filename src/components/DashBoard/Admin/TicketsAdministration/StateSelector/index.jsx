import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import SingleSelectById from '../SingleSelectById';

const StateSelector = ({ handleChange, TransactionStates, id = "filterState" }) => {
    const { t } = useTranslation();

    return (
        <Form.Group className="mt-2 mb-3">
            <Form.Label>{t("State")}</Form.Label>
            <SingleSelectById
                isClearable placeholder={t('Concept')}
                id={id} handleChange={handleChange} FormData={{ [id]: TransactionStates.selected }}
                options={TransactionStates.values.map((state) => ({ value: state.id, label: t(state.name) }))}
            />
        </Form.Group>
    )
}
export default StateSelector


