import React from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PermissionGrouper = ({ permissions, type, setFormData, disabled }) => {
    const { t } = useTranslation()

    const allChecked = () =>
        permissions.filter(
            permission =>
                permission.action.split('_').includes(type) &&
                (permission.action.split('_').includes("SHARE") || permission.action.split('_').includes("FUND") || permission.action.split('_').includes("STAKE") || permission.action.split('_').includes("STAKES"))
        ).length ===
        permissions.filter(
            permission =>
                permission.action.split('_').includes(type) &&
                (permission.action.split('_').includes("SHARE") || permission.action.split('_').includes("FUND") || permission.action.split('_').includes("STAKE") || permission.action.split('_').includes("STAKES")) &&
                permission.allowed
        ).length

    const togglePermissionWithThatType = () => {
        setFormData(
            prevState =>
            ({
                ...prevState,
                permissions: prevState.permissions.map(
                    permissionMap => {
                        const actionSplitted = permissionMap.action.split('_')
                        return actionSplitted.includes(type) &&
                            (actionSplitted.includes("SHARE") || actionSplitted.includes("FUND") || actionSplitted.includes("STAKE") || actionSplitted.includes("STAKES"))
                            ? { ...permissionMap, allowed: !allChecked() } : permissionMap
                    }
                )
            })
        )
    }

    return (
        <Form.Check
            checked={allChecked()}
            label={t(type)}
            onChange={() => togglePermissionWithThatType()}
            type="switch"
            id="custom-switch"
            disabled={disabled}
        />
    )

}

export default PermissionGrouper