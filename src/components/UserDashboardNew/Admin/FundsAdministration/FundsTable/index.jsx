import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table, Form } from 'react-bootstrap'
import FundRow from './FundRow'
import AddFundRow from './AddFundRow'

const FundsTable = ({ Funds, AssetTypes,chargeFunds }) => {

    const { t } = useTranslation();
    const [validated, setValidated] = useState(false);

    const [newFund, setNewFund] = useState({
        name: "",
        shares: 0,
        freeShares: 0,
        sharePrice: 0,
        typeId:1
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
        const token=sessionStorage.getItem("access_token")
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify( newFund ),
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
            <Table striped bordered hover>
                <thead className="verticalTop">
                    <tr>
                        <th>{t("#id")}</th>
                        <th>{t("Name")}</th>
                        <th>{t("Type")}</th>
                        <th>{t("Shares")}</th>
                        <th>{t("Free Shares")}</th>
                        <th>{t("Share Price")}</th>
                        <th>{t("Actions")}</th>
                    </tr>

                </thead>
                <tbody>
                    <AddFundRow newFund={newFund} setNewFund={setNewFund} AssetTypes={AssetTypes} setValidated={setValidated} />
                    {Funds.map((Fund, key) => {
                        return <FundRow AssetTypes={AssetTypes} Fund={Fund} key={key} chargeFunds={chargeFunds}/>
                    })}
                </tbody>
            </Table>
        </Form>
    )
}
export default FundsTable