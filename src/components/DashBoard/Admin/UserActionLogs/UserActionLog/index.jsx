import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DetailModal from "./DetailModal";
import { useMemo } from "react";

const UserActionLog = ({ Log, User, Users, Accounts, Clients, Funds }) => {
    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)
    const Fund = useMemo(() => Funds.find(fund => fund.id === Log.fundId), [Funds, Log.fundId])
    const user = useMemo(() => Users.find(fund => fund.id === Log.eventMetadata?.userId), [Log.eventMetadata?.userId, Users])
    const client = useMemo(() => Clients.find(fund => fund.id === Log.eventMetadata?.clientId), [Clients, Log.eventMetadata?.clientId])
    console.log(client)
    const extraData = useMemo(() => {
        let result = []
        if (Fund) result.push(Fund.name)
        if (user) result.push(`${t("User")} ${user.email}`)
        if (client) result.push(`${t("client")} ${client.alias}`)
        if(result.length > 0) return "(" + result.join(", ") + ")"
        return
    }, [Fund, client, t, user])
    return (
        <tr>
            <td className="Alias">{moment(Log.createdAt).format('l')} {moment(Log.createdAt).format('LT')}</td>
            <td className="Alias">{User?.email || "-"}</td>
            <td className="Alias">{User?.firstName || User?.lastName ? (User?.firstName + " " + User?.lastName) : "-"}</td>
            <td className="Alias">
                {t(Log?.eventType)}
                {extraData && <><br/>{extraData }</>}
            </td>
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