import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DetailModal from "./DetailModal";

const UserActionLog = ({ Log, User, Users, Accounts, Clients }) => {
    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)

    return (
        <tr>
            <td className="Alias">{moment(Log.createdAt).format('l')} {moment(Log.createdAt).format('LT')}</td>
            <td className="Alias">{User.email}</td>
            <td className="Alias">{User.firstName || User.lastName ? (User.firstName + " " + User.lastName ): "-"}</td>
            <td className="Alias">{t(Log.eventType)}</td>
            <td className="Alias text-center">
                <span className="text-center">
                    {
                        Log.movementId ?
                            <>
                                <button type="button" className="noStyle" onClick={() => setShowModal(true)}  >
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </button>
                                <DetailModal Users={Users} Accounts={Accounts} Clients={Clients} ShowModal={ShowModal} setShowModal={setShowModal} Log={Log} />
                            </>
                            :
                            "-"
                    }
                </span>
            </td>
        </tr>
    );
}

export default UserActionLog