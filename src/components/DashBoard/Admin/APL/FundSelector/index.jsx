import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const FundSelector = ({ SelectedFund, setSelectedFund, Funds }) => {
    const handleChange = (event) => {
        setSelectedFund(event.target.value)
    }

    const { t } = useTranslation()

    return (
        <>
            <Form.Select className="my-2" value={SelectedFund} onChange={handleChange} >
                <option disabled value="">{t("Open this select menu")}</option>
                {Funds.map((Fund, key) =>
                    <option key={key} value={key}>
                        {Fund.name}
                    </option>
                )}
            </Form.Select>
        </>
    )
}
export default FundSelector