import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Form, Table, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers, selectAllusers } from 'Slices/DashboardUtilities/usersSlice';
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import EmptyTable from "components/DashBoard/GeneralUse/EmptyTable";
import { ContextAwareToggle } from '../Operations/OperationsTable';
import { User } from './User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { selectAllclients } from 'Slices/DashboardUtilities/clientsSlice';
import ClientsSearch from '../ClientsSupervision/ClientSelector/ClientsSearch';

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


    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const sortData = (field) => {
        if (sortField === field && sortDirection === 'desc') {
            setSortField(null);
            setSortDirection('asc');
        }
        else {
            let direction = 'asc';
            if (sortField === field && sortDirection === 'asc') {
                direction = 'desc';
            }
            setSortField(field);
            setSortDirection(direction);
        }
    };
    const clients = useSelector(selectAllclients)

    const [search, setSearch] = useState("")
    const usersSorted = useMemo(() => [...users]
        .map(user => {
            const userClients = clients.filter(client => client.users.find(clientUser => clientUser.userId === user.id)).sort(
                (a, b) => {
                    if (a.alias === b.alias) return 0
                    return a.alias < b.alias ? -1 : 1
                }
            )

            return ({
                ...user,
                userClients,
                completeName: `${user?.firstName || user?.lastName ? (user?.firstName + " " + user?.lastName) : "-"}`,
                firstClientName: userClients?.[0]?.alias || "-",
            })
        }).filter(user => {

            if (search === "") {
                return true
            }
            function extractValues(data, ignoreKeys = ["users", "userClients"]) {
                let result = [];

                if (Array.isArray(data)) {
                    data.forEach(value => {
                        if (Array.isArray(value) || typeof value === 'object') {
                            result = result.concat(extractValues(value, ignoreKeys));
                        } else {
                            result.push(value);
                        }
                    });
                } else if (typeof data === 'object' && !!(data)) {
                    Object.entries(data).forEach(([key, value]) => {
                        if (ignoreKeys.includes(key)) {
                            return;
                        }
                        if (Array.isArray(value) || typeof value === 'object') {
                            result = result.concat(extractValues(value, ignoreKeys));
                        } else {
                            result.push(value);
                        }
                    });
                }

                return result;
            }


            const values = extractValues(user);
            const words = search.split(' ');
            const regexes = words.map(word => new RegExp(word, 'gi'));
            const matchesAllWords = values => {
                return regexes.every(regex => values.some(value => regex.test(value)));
            };
            if (matchesAllWords(values)) {
                console.log(user, values, search)
            }
            return matchesAllWords(values);
        }).sort((a, b) => {
            if (sortField) {
                const aValue = (sortField === "approvedBy" ? a[sortField][0] : a[sortField]) || ""
                const bValue = (sortField === "approvedBy" ? b[sortField][0] : b[sortField]) || ""
                if (aValue === "" || aValue === "-") return (bValue === "" || bValue === "-") ? 1 : (sortDirection === 'asc' ? 1 : -1)
                if (bValue === "" || bValue === "-") return (aValue === "" || aValue === "-") ? -1 : (sortDirection === 'asc' ? -1 : +1)
                if (sortField === "createdAt") {
                    return sortDirection === 'asc' ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue);
                } if (sortField === "approvedBy") {
                    return sortDirection === 'asc' ? (aValue).localeCompare(bValue) : (bValue).localeCompare(aValue);
                } else if (typeof aValue === 'string') {
                    return sortDirection === 'asc' ? (aValue).localeCompare(bValue) : (bValue).localeCompare(aValue);
                } else {
                    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }
            }
            return 0;
        }), [clients, search, sortDirection, sortField, users])

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
            <ClientsSearch
                handleSearch={(e) => setSearch(e.target.value)}
                SearchText={search}
                cancelSearch={() => setSearch("")}
                FilteredClients={usersSorted}
                Clients={users}
                label={"Search"}
            />
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
                                        <th className="id" onClick={() => sortData('email')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Email")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "email" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="Alias" onClick={() => sortData('completeName')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Name")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "completeName" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="Alias" onClick={() => sortData('dni')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("DNI")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "dni" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="balance" onClick={() => sortData('phone')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Phone")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "phone" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="balance" onClick={() => sortData('address')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Address")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "address" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="balance" onClick={() => sortData('firstClientName')} style={{ cursor: "pointer" }}>
                                            <span className='d-flex'>
                                                <span>
                                                    {t("Client")}
                                                </span>
                                                <FontAwesomeIcon className="ms-auto" icon={sortField === "firstClientName" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                            </span>
                                        </th>
                                        <th className="Balance"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersSorted.map(user => <User key={user.id} user={user} />)}
                                </tbody>
                            </Table>
                        </div>
                    </div>

            }

        </Col>)
}