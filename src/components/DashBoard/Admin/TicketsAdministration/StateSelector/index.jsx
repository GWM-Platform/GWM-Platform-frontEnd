import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const StateSelector = ({ handleChange, TransactionStates }) => {
    const { t } = useTranslation();

    return (
        <Form.Group className="mt-2 mb-3">
            <Form.Label>{t("State")}</Form.Label>
            <Form>
                <Form.Select required onChange={handleChange} value={TransactionStates.selected}>
                    <option value="">{t("All")}</option>
                    {
                        TransactionStates.values.map(
                            (state, key) => <option value={state.id} key={key}>{t(state.name)} </option>

                        )
                    }
                </Form.Select>
            </Form>
        </Form.Group>
    )
}
export default StateSelector


