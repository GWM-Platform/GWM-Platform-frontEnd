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
import { fetchusers } from "Slices/DashboardUtilities/usersSlice";


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
        dispatch(fetchusers({ all: true }))
        dispatch(fetchOperations(fetchOperationsParams))
    }
    const currentUserId = userId()

    return (
        <tr>
            <td className="Alias">{moment(Operation.createdAt).format('l')} {moment(Operation.createdAt).format('LT')}</td>
            <td className="Alias">{User?.firstName || User?.lastName ? (User?.firstName + " " + User?.lastName) : "-"}</td>
            <td className="Alias">
                {t(Operation?.operationType)}
                {
                    Operation.operationType === "LIQUIDATE_FUND" && (
                        Fund ?
                            <>
                                &nbsp;({Fund.name}, {t("share_price")}: <FormattedNumber prefix="U$D " value={Operation?.operationMetadata?.customSharePrice} fixedDecimals={2} />)
                            </>
                            :
                            ""
                    )
                }
                {
                    Operation.operationType === "CREATE_ADMIN" &&
                    <>
                        &nbsp;({Operation.operationMetadata.email})
                    </>
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
            <td className="Alias" >
                {
                    Operation.stateId === 1 &&
                    <div className={`h-100 d-flex align-items-center justify-content-around Actions`}>
                        {
                            <>
                                <div title={currentUserId + "" === Operation.userId + "" ? t("Another admin must approve this operation") : null} >
                                    <div className={`iconContainer green me-1 ${currentUserId + "" === Operation.userId + "" ? "disabled" : ""}`} >
                                        <FontAwesomeIcon className="icon me-2" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                                    </div>
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