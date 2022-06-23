import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import EditForm from './EditForm'
import EditResult from './EditResult'

const EditRule = ({ ActionDispatch, rule, setTimeDeposit }) => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        days: rule.days,
        rate: rule.rate,
    })

    const editRule = async () => {
        setTimeDeposit(prevState => {
            let aux = [...prevState?.content?.rules]
            const index = prevState.content.rules.findIndex(ruleFI => ruleFI.id === rule.id)
            aux[index] = { ...aux[index], ...data }
            return { ...prevState, content: { ...prevState.content, rules: aux } }
        })
        setEditRequest(
            {
                ...EditRequest, ...{
                    fetching: true,
                    fetched: false,
                    valid: false
                }
            }
        )

        if (true) {
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
        }
    }


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
            editRule()
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        let aux = data
        aux[event.target.id] = parseInt(event.target.value) || event.target.value
        setData({ ...data, ...aux })
    }

    return (
        <>
            {
                EditRequest.fetched ?
                    <EditResult ActionDispatch={ActionDispatch} EditRequest={EditRequest} />
                    :
                    <EditForm
                        fetchingEditRequest={EditRequest?.fetching} ActionDispatch={ActionDispatch}
                        data={data} handleChange={handleChange} handleSubmit={handleSubmit} validated={validated} />
            }
        </>
    )
}

export default EditRule