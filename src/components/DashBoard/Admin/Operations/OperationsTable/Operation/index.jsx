import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchFunds, selectFundById } from "Slices/DashboardUtilities/fundsSlice";
import FormattedNumber from "components/DashBoard/GeneralUse/FormattedNumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import ActionConfirmationModal from "./ActionConfirmationModal";
import { fetchOperations } from "Slices/DashboardUtilities/operationsSlice";
import { userId } from "utils/userId";


const Operation = ({ Operation, User, fetchOperationsParams = {} }) => {
    const { t } = useTranslation();
    const Fund = useSelector(state => selectFundById(state, Operation?.operationMetadata?.fundId))

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")


    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    const dispatch = useDispatch()
    const refetch = () => {
        dispatch(fetchFunds())
        dispatch(fetchOperations(fetchOperationsParams))
    }
    const currentUserId = userId()

    return (
        <tr>
            <td className="Alias">{moment(Operation.createdAt).format('l')} {moment(Operation.createdAt).format('LT')}</td>
            <td className="Alias">{User?.firstName || User?.lastName ? (User?.firstName + " " + User?.lastName) : "-"}</td>
            <td className="Alias">
                {t(Operation?.operationType)}{
                    Fund ?
                        <>
                            &nbsp;({Fund.name}, {t("share_price")}: <FormattedNumber prefix="U$D " value={Operation?.operationMetadata?.customSharePrice} fixedDecimals={2} />)
                        </>
                        :
                        ""
                }
            </td>
            <td className="Alias">
                {t({
                    1: "Pending",
                    2: "Approved",
                    3: "Denied",
                    4: "Liquidated",
                    5: "Client pending",
                    6: "Admin sign pending"
                }[Operation.stateId])}
            </td>
            <td className="Alias" title={currentUserId + "" === Operation.userId + "" ? t("Another admin must approve or deny this ticket") : null}>
                {
                    Operation.stateId === 1 &&
                    <div className={`h-100 d-flex align-items-center justify-content-around Actions ${currentUserId + "" === Operation.userId + "" ? "disabled" : ""}`}>
                        {
                            <>
                                <div className="iconContainer green me-1">
                                    <FontAwesomeIcon className="icon me-2" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                                </div>
                                <div className="iconContainer red me-1">
                                    <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                                </div>
                            </>
                        }
                        {
                            ShowModal &&
                            <ActionConfirmationModal reloadData={refetch} Operation={Operation} setShowModal={setShowModal} action={Action} show={ShowModal} />
                        }
                    </div>
                }
            </td>
        </tr>
    );
}

export default Operation