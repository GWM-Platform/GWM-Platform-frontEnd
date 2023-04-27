import React, { useContext } from 'react'

import { DashBoardContext } from 'context/DashBoardContext';
import { useTranslation } from "react-i18next";

import { Dropdown, Col } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const ClientSelector = () => {
    const { t } = useTranslation();
    const { UserClients, IndexClientSelected, setIndexClientSelected, ClientSelected, admin } = useContext(DashBoardContext)

    return ((admin && UserClients.content.length > 0) || (!admin && ClientSelected && UserClients.content.length > 1) ?
        <Dropdown className="d-block d-md-none clientSelector">
            <Dropdown.Toggle
                variant="secondary btn-sm"
                className="bg-none ps-3"
                id="dropdown-clients">
                {
                    IndexClientSelected === -1 ?
                        t("Admin Panel")
                        :
                        <>
                            <span className='d-none d-sm-inline-block'>{t("Hi")},&nbsp;</span>
                            <span>{ClientSelected.alias}</span>
                            <span className='d-none d-inline-block'>!</span>
                        </>

                }
                <FontAwesomeIcon className='smaller-client-selector' icon={faCircleUser} />
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
            <div>
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
