import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import EditForm from './EditForm'
import EditResult from './EditResult'
import { DashBoardContext } from 'context/DashBoardContext';
import axios from 'axios';

const EditRule = ({ ActionDispatch, rule, FixedDeposit, getFixedDepositPlans }) => {

    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        days: rule.days,
        rate: rule.rate,
    })

    const { toLogin } = useContext(DashBoardContext)

    const editRule = () => {
        setEditRequest({
            ...EditRequest,
            fetching: true,
            fetched: false,
            valid: false
        })

        let FixedDepositEdited = { ...FixedDeposit, interest: { ...FixedDeposit.interest, [data.days]: data.rate } }

        axios.put(`/fixed-deposits/plans/${FixedDeposit?.id}`, FixedDepositEdited).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setEditRequest({
                    ...EditRequest, ...{
                        fetching: false,
                        fetched: true,
                        valid: true
                    }
                })
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setEditRequest({
                            ...EditRequest, ...{
                                fetching: false,
                                fetched: true,
                                valid: false
                            }
                        })
                        break;
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setEditRequest({
                    ...EditRequest, ...{
                        fetching: false,
                        fetched: true,
                        valid: false
                    }
                })
            }
        });
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
        if (form.checkValidity() && !EditRequest.fetching) {
            editRule()
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        let aux = data
        aux[event.target.id] = event.target.value
        setData({ ...data, ...aux })
    }

    return (
        <>
            {
                EditRequest.fetched ?
                    <EditResult ActionDispatch={ActionDispatch} EditRequest={EditRequest} getFixedDepositPlans={getFixedDepositPlans} />
                    :
                    <EditForm
                        fetchingEditRequest={EditRequest?.fetching} ActionDispatch={ActionDispatch}
                        data={data} handleChange={handleChange} handleSubmit={handleSubmit} validated={validated} />
            }
        </>
    )
}

export default EditRule