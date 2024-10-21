import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap'
import './index.css'

import { DashBoardContext } from 'context/DashBoardContext';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

const ClientSelector = () => {
    const { t } = useTranslation();
    const { UserClients, IndexClientSelected, setIndexClientSelected, ClientSelected, admin, favouriteIndexClient, setFavouriteIndexClient } = useContext(DashBoardContext)

    const toggleFavourite = (index) => {
        const userClient = UserClients.content[index]
        if (userClient) {
            if (index === favouriteIndexClient) {
                setFavouriteIndexClient(null)
                localStorage.removeItem(UserClients.content[0].alias)
            } else {
                setFavouriteIndexClient(index)
                localStorage.setItem(UserClients.content[0].alias, index)
            }
        }
    }

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
                            <Dropdown.Item className="d-flex" key={key} disabled={!client.enabled || !client?.userToClientEnabled} active={IndexClientSelected === key ? true : false} onClick={() => { setIndexClientSelected(key) }}>
                                <span className='me-2'>
                                    {client.alias}
                                </span>
                                <button className="no-style btn ms-auto" style={{
                                    opacity: (!client.enabled || !client?.userToClientEnabled) ? 0 : 1
                                }} type="button" onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavourite(key)
                                }}>
                                    <FontAwesomeIcon style={{ marginBottom: ".125em", color: "var(--blue-main)" }} size='xs' icon={favouriteIndexClient === key ? faStarSolid : faStar} />
                                </button>
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
