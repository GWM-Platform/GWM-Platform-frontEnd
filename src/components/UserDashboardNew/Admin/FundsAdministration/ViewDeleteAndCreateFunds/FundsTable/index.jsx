import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table, Form } from 'react-bootstrap'
import FundRow from './FundRow'
import AddFundRow from './AddFundRow'

const FundsTable = ({ Funds, AssetTypes, chargeFunds, setFundSelected }) => {

    const { t } = useTranslation();
    const [validated, setValidated] = useState(false);

    const [newFund, setNewFund] = useState({
        name: "",
        shares: 0,
        freeShares: 0,
        sharePrice: 0,
        typeId: 1
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;

        if (form.checkValidity()) {
            createFund()
        }
        setValidated(true);
    };

    const createFund = async () => {
        const url = `${process.env.REACT_APP_APIURL}/funds`;
        const token = sessionStorage.getItem("access_token")
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(newFund),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            chargeFunds()
        } else {
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Table className="FundsTable" striped bordered hover>
                <thead className="verticalTop">
                    <tr>
                        <th className="id">{t("#id")}</th>
                        <th className="Name">{t("0000000000")}</th>
                        <th className="Type">{t("Type")}</th>
                        <th className="Shares">{t("Shares")}</th>
                        <th className="FreeShares">{t("Free Shares")}</th>
                        <th className="SharePrice">{t("Share Price")}</th>
                        <th className="Actions">{t("Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    <AddFundRow newFund={newFund} setNewFund={setNewFund} AssetTypes={AssetTypes} setValidated={setValidated} />
                    {Funds.map((Fund, key) => {
                        return <FundRow AssetTypes={AssetTypes} Fund={Fund} key={key} ownKey={key}
                            chargeFunds={chargeFunds} setFundSelected={setFundSelected} />
                    })}
                </tbody>
            </Table>
        </Form>
    )
}
export default FundsTable