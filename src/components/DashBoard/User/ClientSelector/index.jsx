import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap'
import './index.css'
import "flag-icon-css/css/flag-icon.min.css"
import { dashboardContext } from '../../../../context/dashboardContext';

const ClientSelector = () => {

    const { UserClients, IndexClientSelected, setIndexClientSelected, ClientSelected } = useContext(dashboardContext)

    return (
        ClientSelected ?
            <Dropdown className="clientSelector">
                <Dropdown.Toggle
                    variant="secondary btn-sm"
                    className="bg-none"
                    id="dropdown-clients">
                    {ClientSelected.alias}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        UserClients.map((client, key) => {
                            return (
                                <Dropdown.Item key={key} active={IndexClientSelected === key ? true : false} onClick={() => { setIndexClientSelected(key) }}>
                                    {client.alias}
                                </Dropdown.Item>
                            )
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
            :
            null
    )
}
export default ClientSelector
