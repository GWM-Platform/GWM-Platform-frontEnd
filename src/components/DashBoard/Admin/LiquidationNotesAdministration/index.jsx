import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { NotesTable } from './NotesTable';
import { Add } from './Add';
import { Edit } from './Edit';

const LiquidationNotesAdministration = () => {
    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                <Switch>
                    <Route exact path="/DashBoard/liquidationNotesAdministration">
                        <NotesTable />
                    </Route>
                    <Route path="/DashBoard/liquidationNotesAdministration/creation">
                        <Add />
                    </Route>
                    <Route path="/DashBoard/liquidationNotesAdministration/edit/:id">
                        <Edit />
                    </Route>
                </Switch>
            </Row>
        </Container>
    )
}
export default LiquidationNotesAdministration
