import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import UserItem from "./UserItem";
import './index.scss'
import Loading from 'components/DashBoard/GeneralUse/Loading';
import NoMovements from "components/DashBoard/GeneralUse/NoMovements";

const ClientUsersAccordion = ({ client, users, getUsers, ownersAmount }) => {

    const { t } = useTranslation()

    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{t("Users connected to the client")}</Accordion.Header>
                <Accordion.Body className="usersList">
                    {
                        users.fetching ?
                            <Loading movements={4} />
                            :
                            users.content.length > 0 ?
                                users.content.map(user =>
                                    <UserItem ownersAmount={ownersAmount} getUsers={getUsers} user={user} client={client} key={`user-tem-${client.id}-${user.id}`} />
                                )
                                :
                                <NoMovements movements={4} />
                    }
                    <div className="mt-2 d-flex justify-content-end">
                        <Link to={`/DashBoard/clientsSupervision/${client.id}/connectUserToClient`}>
                            <Button disabled={users.fetching}>{t("Connect a new user")}</Button>
                        </Link>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default ClientUsersAccordion