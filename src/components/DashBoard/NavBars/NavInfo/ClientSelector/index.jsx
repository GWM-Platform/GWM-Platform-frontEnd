import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown,Col } from 'react-bootstrap'
import './index.css'
import "flag-icon-css/css/flag-icon.min.css"
import { DashBoardContext } from 'context/DashBoardContext';
import { useTranslation } from "react-i18next";

const ClientSelector = () => {
    const { t } = useTranslation();
    const { UserClients, IndexClientSelected, setIndexClientSelected, ClientSelected, admin } = useContext(DashBoardContext)

    return ((admin && UserClients.length > 0) || (!admin && ClientSelected && UserClients.length > 1) ?
        <Dropdown className="d-block d-md-none clientSelector">
            <Dropdown.Toggle
                variant="secondary btn-sm"
                className="bg-none"
                id="dropdown-clients">
                {
                    IndexClientSelected === -1 ? 
                    t("Admin Panel")
                     : 
                    <>{t("Hi")},&nbsp;{ClientSelected.alias}!</>

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
        <Col className="d-flex d-md-none align-items-center px-0">
            <div className="d-none d-md-block">
                <h1 className="greeting p-0 my-0" >
                    {t("Hi")},
                    {` ${ClientSelected.firstName === undefined ? "" : ClientSelected.firstName === "-" ? "" : ClientSelected.firstName} 
                                ${ClientSelected.lastName === undefined ? "" : ClientSelected.lastName === "-" ? "" : ClientSelected.lastName}`}!
                </h1>
            </div>
        </Col>
    )
}
export default ClientSelector
