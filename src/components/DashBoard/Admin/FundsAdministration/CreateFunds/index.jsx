import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'

import CreateForm from './CreateForm'
import CreateResult from './CreateResult'
const CreateFunds = ({ Funds, AssetTypes, chargeFunds, Action, setAction }) => {

    const [validated, setValidated] = useState(false);

    const [data, setData] = useState({
        name: "",
        typeId: "",
        shares: "",
        initialSharePrice: "",
        spreadsheetId: "",
        imageUrl: "",
    })

    const [ImageUrl, setImageUrl] = useState({
        fetched: false,
        fetching: false,
        valid: false
    })

    const createFund = async () => {
        setCreateRequest(
            {
                ...CreateRequest, ...{
                    fetching: true,
                    fetched: false,
                    valid: false
                }
            }
        )
        const url = `${process.env.REACT_APP_APIURL}/funds`;
        const token = sessionStorage.getItem("access_token")
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ ...data, spreadsheetId: extractGoogleStyleSpreadSheetID(data.spreadsheetId) }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            setCreateRequest(
                {
                    ...CreateRequest, ...{
                        fetching: false,
                        fetched: true,
                        valid: true
                    }
                }
            )
        } else {
            setCreateRequest(
                {
                    ...CreateRequest, ...{
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

    const [CreateRequest, setCreateRequest] = useState({
        fetching: false,
        fetched: false,
        valid: false
    })

    const extractGoogleStyleSpreadSheetID = (url) => {
        const urlRegExp = new RegExp((`^https://docs.google.com/spreadsheets/d/[a-zA-Z0-9_-]{1,}/edit#gid=[0-9]{1,}`), 'i')
        if (urlRegExp.test(url)) {
            let id = url.slice(39).split('/')[0]
            return id ? id : false
        } else return false

    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() && ImageUrl.fetched && ImageUrl.valid) {
            createFund()
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        let aux = data
        aux[event.target.id] = parseInt(event.target.value) || event.target.value
        setData({ ...data, ...aux })
    }

    const checkImage = async (url) => {
        setImageUrl(prevState => ({ ...prevState, ...{ fetching: true, fetched: false } }))
        const res = await fetch(url);
        const buff = await res.blob();
        setImageUrl(prevState => ({ ...prevState, ...{ fetching: false, fetched: true, valid: buff.type.startsWith('image/') } }))
    }

    return (
        <Col sm="12" md="10">
            {
                CreateRequest.fetched ?
                    <CreateResult CreateRequest={CreateRequest} setAction={setAction} chargeFunds={chargeFunds}
                        Funds={Funds} Action={Action} />
                    :
                    <CreateForm
                        ImageUrl={ImageUrl} setImageUrl={setImageUrl} checkImage={checkImage}
                        data={data} handleChange={handleChange} handleSubmit={handleSubmit} CreateRequest={CreateRequest}
                        Funds={Funds} Action={Action} setAction={setAction} validated={validated} AssetTypes={AssetTypes}
                    />
            }

        </Col>
    )
}

export default CreateFunds