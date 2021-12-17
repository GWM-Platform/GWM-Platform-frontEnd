import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const StateSelector = ({ handleChange, TransactionStates }) => {
    const { t } = useTranslation();

    return (
        <Col xs="12" className="growAnimation">
            <Form>
                <Form.Select className="my-3" required onChange={handleChange} value={TransactionStates.selected}>
                    <option disabled value="">{t("Select a state to list the transactions with it")}</option>
                    {
                        TransactionStates.values.map(
                            (state, key) => {
                                return <option value={state.id} key={key}>{state.id}. {state.name} </option>
                            }
                        )
                    }
                </Form.Select>
            </Form>
        </Col>
    )
}
export default StateSelector


