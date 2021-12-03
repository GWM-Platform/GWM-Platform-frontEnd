import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'

import EditForm from './EditForm'
import EditResult from './EditResult'
const EditFunds = ({ Funds, AssetTypes, chargeFunds, FundSelected, setFundSelected }) => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        name: Funds[FundSelected].name,
        typeId: Funds[FundSelected].typeId,
        shares: Funds[FundSelected].shares,
        freeShares: Funds[FundSelected].freeShares,
        sharePrice: Funds[FundSelected].sharePrice,

    })

    const [EditRequest, setEditRequest] = useState({
        fetching: false,
        fetched: false,
        valid: false
    })

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            editFund()
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        let aux = data
        aux[event.target.id] = parseInt(event.target.value) || event.target.value
        setData({ ...data, ...aux })
    }

    const editFund = async () => {
        setEditRequest(
            {
                ...EditRequest,
                fetching: true,
                fetched: false,
                valid: false
            }
        )

        const url = `${process.env.REACT_APP_APIURL}/funds/${Funds[FundSelected].id}`;
        const token = sessionStorage.getItem("access_token")
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            setEditRequest(
                {
                    ...EditRequest,
                    fetching: false,
                    fetched: true,
                    valid: true
                }
            )
        } else {
            setEditRequest(
                {
                    ...EditRequest,
                    fetching: false,
                    fetched: true,
                    valid: false
                }
            )
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Col sm="12" md="10">
            {
                EditRequest.fetched ?
                    <EditResult EditRequest={EditRequest} setFundSelected={setFundSelected} chargeFunds={chargeFunds}
                        Funds={Funds} FundSelected={FundSelected} />
                    :
                    <EditForm
                        data={data} handleChange={handleChange} handleSubmit={handleSubmit} EditRequest={EditRequest}
                        Funds={Funds} FundSelected={FundSelected} setFundSelected={setFundSelected} validated={validated} AssetTypes={AssetTypes}
                    />
            }

        </Col>
    )
}

export default EditFunds