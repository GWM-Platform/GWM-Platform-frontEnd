import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import { customFetch } from 'utils/customFetch';

import EditForm from './EditForm'
import EditResult from './EditResult'

const EditLiquidationNotes = ({ Notes, chargeNotes, Action, setAction }) => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        nombre: Notes[Action.note]?.nombre || ""
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

        if (form.checkValidity() && !EditRequest.fetching) {
            editNote()
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        let aux = data
        aux[event.target.id] = event.target.value
        setData({ ...data, ...aux })
    }

    const editNote = async () => {
        setEditRequest({
            ...EditRequest,
            fetching: true,
            fetched: false,
            valid: false
        })

        const url = `${process.env.REACT_APP_APIURL}/liquidation-notes/${Notes[Action.note].id}`;
        const token = sessionStorage.getItem("access_token")
        const response = await customFetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            setEditRequest({
                ...EditRequest,
                fetching: false,
                fetched: true,
                valid: true
            })
        } else {
            setEditRequest({
                ...EditRequest,
                fetching: false,
                fetched: true,
                valid: false
            })
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Col sm="12">
            {
                EditRequest.fetched ?
                    <EditResult 
                        EditRequest={EditRequest} 
                        setAction={setAction} 
                        chargeNotes={chargeNotes}
                        Notes={Notes} 
                        Action={Action} 
                    />
                    :
                    <EditForm
                        data={data} 
                        setData={setData} 
                        handleChange={handleChange} 
                        handleSubmit={handleSubmit} 
                        EditRequest={EditRequest}
                        Notes={Notes} 
                        Action={Action} 
                        setAction={setAction} 
                        validated={validated}
                    />
            }
        </Col>
    )
}

export default EditLiquidationNotes

