import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import { customFetch } from 'utils/customFetch';

import EditForm from './EditForm'
import EditResult from './EditResult'
import { extractGoogleStyleSpreadSheetID } from '../CreateFunds';
const EditFunds = ({ Funds, AssetTypes, chargeFunds, Action, setAction, withoutHeader = false }) => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        name: Funds[Action.fund].name,
        spreadsheetId: `https://docs.google.com/spreadsheets/d/${Funds[Action.fund].spreadsheetId}/edit?usp=sharing`,
        imageUrl: Funds[Action.fund].imageUrl ? Funds[Action.fund].imageUrl : "",
        disabled: Funds[Action.fund].disabled,
        disabledBuy: Funds[Action.fund].disabledBuy ?? false,
        disabledSell: Funds[Action.fund].disabledSell ?? false
    })

    const [EditRequest, setEditRequest] = useState({
        fetching: false,
        fetched: false,
        valid: false
    })

    const [ImageUrl, setImageUrl] = useState({
        fetched: false,
        fetching: false,
        valid: false
    })

    useEffect(() => {
        if (Funds[Action.fund].imageUrl) checkImage(Funds[Action.fund].imageUrl)
    }, [Funds, Action.fund])

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() && !EditRequest.fetching && ImageUrl.fetched && ImageUrl.valid) {
            editFund()
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        let aux = data
        aux[event.target.id] = event.target.type === "checkbox" ? event.target.checked : event.target.value
        setData({ ...data, ...aux })
    }

    const editFund = async () => {
        setEditRequest(
            {
                ...EditRequest, ...{
                    fetching: true,
                    fetched: false,
                    valid: false
                }
            }
        )

        const url = `${process.env.REACT_APP_APIURL}/funds/${Funds[Action.fund].id}`;
        const token = sessionStorage.getItem("access_token")
        const response = await customFetch(url, {
            method: 'PUT',
            body: JSON.stringify({ ...data, spreadsheetId: extractGoogleStyleSpreadSheetID(data.spreadsheetId) }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            setEditRequest(
                {
                    ...EditRequest, ...{
                        fetching: false,
                        fetched: true,
                        valid: true
                    }
                }
            )
        } else {
            setEditRequest(
                {
                    ...EditRequest, ...{
                        fetching: false,
                        fetched: true,
                        valid: false
                    }
                }
            )
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    const checkImage = async (url) => {
        setImageUrl(prevState => ({ ...prevState, ...{ fetching: true, fetched: false } }))
        const res = await customFetch(url);
        const buff = await res.blob();
        setImageUrl(prevState => ({ ...prevState, ...{ fetching: false, fetched: true, valid: buff.type.startsWith('image/') } }))
    }
    return (
        <Col sm="12">
            {
                EditRequest.fetched ?
                    <EditResult EditRequest={EditRequest} setAction={setAction} chargeFunds={chargeFunds}
                        Funds={Funds} Action={Action} />
                    :
                    <EditForm
                        withoutHeader={withoutHeader}
                        ImageUrl={ImageUrl} setImageUrl={setImageUrl} checkImage={checkImage}
                        data={data} setData={setData} handleChange={handleChange} handleSubmit={handleSubmit} EditRequest={EditRequest}
                        Funds={Funds} Action={Action} setAction={setAction} validated={validated} AssetTypes={AssetTypes}
                    />
            }

        </Col>
    )
}

export default EditFunds
