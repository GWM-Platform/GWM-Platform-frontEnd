import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';
import { fetchclients } from 'Slices/DashboardUtilities/clientsSlice';
import { Add } from './Add';
import { UsersTable } from './UsersTable';

const AddAccount = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchclients({ all: true, showUsers: true }))
    }, [dispatch])


    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                <Switch>
                    <Route exact path="/DashBoard/users">
                        <UsersTable />
                    </Route>
                    <Route path="/DashBoard/users/creation">
                        <Add />
                    </Route>
                </Switch>

            </Row>
        </Container>
    )
}
export default AddAccount

