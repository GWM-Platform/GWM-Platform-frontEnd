import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import CreateForm from './CreateForm'
import CreateResult from './CreateResult'
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';

const CreateRules = ({ ActionDispatch, FixedDeposit,getFixedDepositPlans }) => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        days: "",
        rate: ""
    })

    const { toLogin } = useContext(DashBoardContext)

    const createRule = () => {
        setCreateRequest(
            {
                ...CreateRequest, ...{
                    fetching: true,
                    fetched: false,
                    valid: false
                }
            }
        )

        let FixedDepositEdited = { ...FixedDeposit, interest: { ...FixedDeposit.interest, [data.days]: data.rate } }

        axios.put(`/fixed-deposits/plans/${FixedDeposit?.id}`, FixedDepositEdited).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
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
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setCreateRequest(
                            {
                                ...CreateRequest, ...{
                                    fetching: false,
                                    fetched: true,
                                    valid: false
                                }
                            }
                        )
                        break;
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
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
        });
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
                    <CreateResult ActionDispatch={ActionDispatch} CreateRequest={CreateRequest} getFixedDepositPlans={getFixedDepositPlans}/>
                    :
                    <CreateForm
                        fetchingCreateRequest={CreateRequest?.fetching} ActionDispatch={ActionDispatch}
                        data={data} handleChange={handleChange} handleSubmit={handleSubmit} validated={validated} />
            }
        </>
    )
}

export default CreateRules