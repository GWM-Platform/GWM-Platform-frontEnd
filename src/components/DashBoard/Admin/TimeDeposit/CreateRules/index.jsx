import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import CreateForm from './CreateForm'
import CreateResult from './CreateResult'

const CreateRules = ({ ActionDispatch, setTimeDeposit }) => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        days: "",
        rate: ""
    })

    const createRule = async () => {
        setTimeDeposit(prevState => {
            let aux = [...prevState?.content?.rules]
            aux = [...aux, ...[{
                ...data, id: Math.max(...prevState?.content?.rules?.map(rule => rule?.id)) + 1
            }]]
            return { ...prevState, content: { ...prevState.content, rules: aux } }
        })
        setCreateRequest(
            {
                ...CreateRequest, ...{
                    fetching: true,
                    fetched: false,
                    valid: false
                }
            }
        )

        if (true) {
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
        if (form.checkValidity()) {
            createRule()
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
                CreateRequest.fetched ?
                    <CreateResult ActionDispatch={ActionDispatch} CreateRequest={CreateRequest} />
                    :
                    <CreateForm
                        fetchingCreateRequest={CreateRequest?.fetching} ActionDispatch={ActionDispatch}
                        data={data} handleChange={handleChange} handleSubmit={handleSubmit} validated={validated} />
            }
        </>
    )
}

export default CreateRules