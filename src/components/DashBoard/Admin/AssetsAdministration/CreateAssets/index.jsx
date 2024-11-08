import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'

import CreateForm from './CreateForm'
import CreateResult from './CreateResult'
import { customFetch } from 'utils/customFetch';

const CreateAssets = ({ Assets, AssetTypes, chargeAssets, Action, setAction }) => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        name: "",
        value: '',
        typeId: 1,
        symbol: ""
    })

    const createAsset = async () => {
        setCreateRequest(
            {
                ...CreateRequest, ...{
                    fetching: true,
                    fetched: false,
                    valid: false
                }
            }
        )
        const url = `${process.env.REACT_APP_APIURL}/assets`;
        const token = sessionStorage.getItem("access_token")
        const response = await customFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
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

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() && !CreateRequest.fetching) {
            createAsset()
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        let aux = data
        aux[event.target.id] = event.target.value
        setData({ ...data, ...aux })
    }

    return (
        <Col sm="12" >
            {
                CreateRequest.fetched ?
                    <CreateResult CreateRequest={CreateRequest} setAction={setAction} chargeAssets={chargeAssets}
                        Assets={Assets} Action={Action} />
                    :
                    <CreateForm
                        data={data} handleChange={handleChange} handleSubmit={handleSubmit} CreateRequest={CreateRequest}
                        Assets={Assets} Action={Action} setAction={setAction} validated={validated} AssetTypes={AssetTypes}
                    />
            }

        </Col>
    )
}

export default CreateAssets