import React, {  useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Form, Table, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import {useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers, selectAllusers } from 'Slices/DashboardUtilities/usersSlice';
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import EmptyTable from "components/DashBoard/GeneralUse/EmptyTable";
import { ContextAwareToggle } from '../Operations/OperationsTable';
import { User } from './User';

export const UsersTable = () => {

    const { t } = useTranslation();

    const usersStatus = useSelector(state => state.users.status)
    const users = useSelector(selectAllusers)
    const dispatch = useDispatch()
    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchusers({ all: true }))
        }
    }, [dispatch, usersStatus])

    const history = useHistory()

    return (
        <Col className="section growOpacity h-100 d-flex flex-column">
            <Accordion style={{ borderBottom: "1px solid #b3b3b3", marginTop: "0.5em", fontSize: "30px" }} >
                <ContextAwareToggle buttonText="Add user" eventKey="0" create={() => history.push("/DashBoard/users/creation")}>
                    {t("Users")}
                </ContextAwareToggle>
                <Accordion.Collapse eventKey="0">
                    <Form noValidate>
                        <Row className="pt-2 g-2">
                            <div className="w-100 m-0 mb-2" />
                        </Row>
                    </Form>
                </Accordion.Collapse>
            </Accordion>
            {
                users?.length === 0 ?
                    usersStatus === "loading" ?
                        <Loading className="h-100 mb-5" />
                        :
                        <EmptyTable className="h-100 mb-5" />
                    :
                    <div className="py-3 w-100">
                        <div className="w-100 overflow-auto">
                            <Table className="ClientsTable mb-0" striped bordered hover>
                                <thead className="verticalTop tableHeader solid-bg">
                                    <tr>
                                        <th className="id">{t("Email")}</th>
                                        <th className="Alias">{t("Name")}</th>
                                        <th className="Alias">{t("DNI")}</th>
                                        <th className="Balance">{t("Phone")}</th>
                                        <th className="Balance">{t("Address")}</th>
                                        <th className="Balance">{t("Client")}</th>
                                        <th className="Balance"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => <User key={user.id} user={user} />)}
                                </tbody>
                            </Table>
                        </div>
                    </div>

            }

        </Col>)
}