import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Loading from 'components/DashBoard/Admin/Loading'
import Error from "components/DashBoard/Admin/Error";
import ViewAndDeleteRules from "./ViewAndDeleteRules";
import CreateRules from "./CreateRules";
import EditRule from "./EditRules";
import { DashBoardContext } from "context/DashBoardContext";
import axios from "axios";

const ActionInitialState = { action: -1, ruleDays: -1 }

const reducerAction = (state, action) => {
    switch (action.type) {
        case 'view':
            return ({ ...state, action: -1, ruleDays: -1 })
        case 'edit':
            return ({ ...state, action: 0, ruleDays: action?.ruleDays });
        case 'create':
            return ({ ...state, action: 1, ruleDays: -1 });
        default:
            throw new Error();
    }
}

const FixedDeposit = () => {
    const { toLogin } = useContext(DashBoardContext)

    const [FixedDeposit, setFixedDeposit] = useState({ fetching: false, fetched: false, valid: false, content: {} })
    const [Action, ActionDispatch] = useReducer(reducerAction, ActionInitialState);//Action.action===-1 -> view;Action.action===0 -> edit; Action.action===1 -> create

    const getFixedDepositPlans = useCallback((signal) => {
        setFixedDeposit((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/fixed-deposits/plans`, {
            signal: signal,
        }).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: response?.data[0] || {} } }))
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                        break
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin]);

    useEffect(() => {

        const controller = new AbortController();
        const signal = controller.signal;

        getFixedDepositPlans(signal)

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [getFixedDepositPlans])

    return (
        <>
            {
                FixedDeposit.fetching ?
                    <Loading />
                    :
                    FixedDeposit.valid ?
                        <Container>
                            <Row>
                                <Col>
                                    {

                                        {
                                            "-1":
                                                <ViewAndDeleteRules FixedDeposit={FixedDeposit?.content} ActionDispatch={ActionDispatch} getFixedDepositPlans={getFixedDepositPlans} />,
                                            0:
                                                <EditRule setFixedDeposit={setFixedDeposit} ActionDispatch={ActionDispatch} FixedDeposit={FixedDeposit?.content} getFixedDepositPlans={getFixedDepositPlans}
                                                    rule={{ days: Action.ruleDays, rate: FixedDeposit?.content?.interest[Action.ruleDays] }} />,
                                            1:
                                                <CreateRules FixedDeposit={FixedDeposit?.content} ActionDispatch={ActionDispatch} getFixedDepositPlans={getFixedDepositPlans} />
                                        }[Action.action]
                                    }
                                </Col>
                            </Row>
                        </Container>
                        :
                        <Error />
            }
        </>
    );
}

export default FixedDeposit