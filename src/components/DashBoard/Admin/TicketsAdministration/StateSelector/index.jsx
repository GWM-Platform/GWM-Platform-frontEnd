import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const StateSelector = ({ handleChange, TransactionStates }) => {
    const { t } = useTranslation();

    return (
        <Col xs="12" className="growAnimation">
            <Form>
                <Form.Select className="mt-3" required onChange={handleChange} value={TransactionStates.selected}>
                    <option value="">{t("All")}</option>
                    {
                        TransactionStates.values.map(
                            (state, key) => <option value={state.id} key={key}>{state.id}. {t(state.name)} </option>

                        )
                    }
                </Form.Select>
            </Form>
        </Col>
    )
}
export default StateSelector


