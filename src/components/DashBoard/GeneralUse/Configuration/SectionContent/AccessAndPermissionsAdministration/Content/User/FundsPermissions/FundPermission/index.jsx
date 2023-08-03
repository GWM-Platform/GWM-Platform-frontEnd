import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FundPermission = ({ fundId, permissions, type, setFormData, disabled, funds, FormData }) => {
    const { t } = useTranslation()

    const permission = permissions.find(
        (permission) => {
            const actionSplitted = permission.action.split('_')
            return actionSplitted.includes(type) && actionSplitted.includes(fundId + "")
        }
    )

    const togglePermission = () => {
        setFormData(
            prevState =>
            ({
                ...prevState,
                permissions: prevState.permissions.map(
                    permissionMap =>
                        permissionMap.id === permission.id ? { ...permission, allowed: !permission.allowed } : permissionMap
                )
            })
        )
    }

    const permissionsDependencies = {
        WITHDRAW: ["VIEW_ACCOUNT"],
        TRANSFER_GENERATE: ["VIEW_ACCOUNT"],
        TRANSFER_APPROVE: ["VIEW_ACCOUNT"],
        TRANSFER_DENY: ["VIEW_ACCOUNT"],
        FIXED_DEPOSIT_CREATE: ["VIEW_ACCOUNT"],
        FIXED_DEPOSIT_PRECANCEL: ["FIXED_DEPOSIT_VIEW"],
        ...funds.reduce(
            (acumulator, fund) => (
                {
                    ...acumulator,
                    [`SELL_STAKES_${fund.id}`]: [`VIEW_FUND_${fund.id}`],
                    [`SHARE_TRANSFER_${fund.id}`]: [`VIEW_FUND_${fund.id}`],
                    [`BUY_STAKES_${fund.id}`]: ["VIEW_ACCOUNT"],
                }
            ), {}),
    }

    const unsatisfiedDependencies = () => {
        const permissionDependencies = permissionsDependencies[permission?.action] || []
        return permissionDependencies?.filter(dependency => !(FormData?.permissions?.find(permissionFind => permissionFind?.action === dependency)?.allowed))
    }

    const hasUnsatisfiedDependencies = () => unsatisfiedDependencies().length > 0



    const composeTraduction = (action) => {
        const isSpecificFundPermission = (action) =>
            action.includes("FUND") && action !== "VIEW_ALL_FUNDS"

        const isStakePermission = (action) =>
            action.includes("STAKE")

        const isSellPermission = (action) =>
            action.includes("SELL")

        const isBuyPermission = (action) =>
            action.includes("BUY")

        const getFundName = (action) => {
            const fundId = action.slice(-1)
            if (!isNaN(+fundId)) {
                return funds?.find(fund => fund?.id === +fundId)?.name || t("Not found")
            } else {
                return t("Not found")
            }
        }

        if (isSpecificFundPermission(action)) {
            return (t("VIEW_FUND", { fundName: getFundName(action) }))
        } else if (isStakePermission(action)) {
            if (isBuyPermission()) {
                return (t("BUY_STAKES", { fundName: getFundName(action) }))
            } else if (isSellPermission(action)) {
                return (t("SELL_STAKES", { fundName: getFundName(action) }))
            } else {
                return (t("Unknown permission"))
            }
        } else {
            return (action === "FIXED_DEPOSIT_CREATE" || action === "DEPOSIT" ?
                t(`PERMISSION_${action}`)
                :
                t(action))
        }
    }

    return (
        <>
            <Form.Check
                checked={permission.allowed}
                onChange={() => togglePermission()}
                type="switch"
                id="custom-switch"
                className="d-inline-block"
                label={t(type)}
                disabled={disabled}
            />
            &nbsp;
            <OverlayTrigger
                overlay={
                    <Tooltip id={`tooltip-notice-${permission.action}`}>
                        {
                            unsatisfiedDependencies().length === 1 ?
                                t("Also need the permission")
                                :
                                t("Also need the permissions")
                        }:
                        {unsatisfiedDependencies().map(unsatisfiedDependency => <span key={`dependency-${permission?.action}-${unsatisfiedDependency}`}><br />- {composeTraduction(unsatisfiedDependency)}</span>)}
                    </Tooltip>
                }
            >
                <div className={`d-inline-block ${!!(hasUnsatisfiedDependencies() && permission?.allowed) ? "" : "invisible"}`}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
            </OverlayTrigger>
        </>
    )

}

export default FundPermission