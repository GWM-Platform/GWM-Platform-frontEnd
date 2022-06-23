import React, { useReducer, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Loading from 'components/DashBoard/Admin/Loading'
import ViewAndEditRules from "./ViewAndEditRules";
import CreateRules from "./CreateRules";
import EditRule from "./EditRules";

const ActionInitialState = { action: -1, ruleId: -1 }

const reducerAction = (state, action) => {
    switch (action.type) {
        case 'view':
            return ({ ...state, action: -1, ruleId: -1 })
        case 'edit':
            return ({ ...state, action: 0, ruleId: action?.ruleId });
        case 'create':
            return ({ ...state, action: 1, ruleId: -1 });
        default:
            throw new Error();
    }
}

const TimeDeposit = () => {

    const [TimeDeposit, setTimeDeposit] = useState({ fetching: false, fetched: true, content: { rules: [{ id: 1, days: 365, rate: 2 }, { id: 2, days: 730, rate: 4 }] } })
    const [Action, ActionDispatch] = useReducer(reducerAction, ActionInitialState);//Action.action===-1 -> view;Action.action===0 -> edit; Action.action===1 -> create

    const getRuleById = (id) => TimeDeposit?.content?.rules?.find(rule => rule.id === id)

    return (
        <>
            {
                TimeDeposit.fetching ?
                    <Loading />
                    :
                    <Container>
                        <Row>
                            <Col>
                                {

                                    {
                                        "-1":
                                            <ViewAndEditRules rules={TimeDeposit?.content?.rules.sort((a, b) => a?.days - b?.days)} ActionDispatch={ActionDispatch} />,
                                        0:
                                            <EditRule setTimeDeposit={setTimeDeposit} rule={getRuleById(Action.ruleId)} ActionDispatch={ActionDispatch} />,
                                        1:
                                            <CreateRules setTimeDeposit={setTimeDeposit} ActionDispatch={ActionDispatch} />
                                    }[Action.action]
                                }
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    );
}

export default TimeDeposit