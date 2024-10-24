import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap'
import './index.css'

import { DashBoardContext } from 'context/DashBoardContext';
import { useTranslation } from "react-i18next";

const ClientSelector = () => {
    const { t } = useTranslation();
    const { UserClients, IndexClientSelected, setIndexClientSelected, ClientSelected, admin } = useContext(DashBoardContext)

    return ((admin && UserClients.content.length > 0) || (!admin && ClientSelected && UserClients.content.length > 1) ?
        <Dropdown className="clientSelector">
            <Dropdown.Toggle
                variant="secondary btn-sm"
                className="bg-none"
                id="dropdown-clients">
                {
                    t("Change account")
                }
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    admin ?
                        <Dropdown.Item active={IndexClientSelected === -1 ? true : false} onClick={() => { setIndexClientSelected(-1) }}>
                            {t("Admin Panel")}
                        </Dropdown.Item>
                        :
                        null
                }
                {
                    UserClients.content.map((client, key) => {
                        return (
                            <Dropdown.Item key={key} disabled={!client.enabled || !client?.userToClientEnabled} active={IndexClientSelected === key ? true : false} onClick={() => { setIndexClientSelected(key) }}>
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
