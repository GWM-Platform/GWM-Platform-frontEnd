import React from "react";
import { Form } from "react-bootstrap";

const FundGrouper = ({ permissions, fundId, fundName, setFormData, disabled }) => {

    const allChecked = () =>
        permissions.filter(
            permission =>
                permission.action.split('_').includes(fundId + "")
        ).length ===
        permissions.filter(
            permission =>
                permission.action.split('_').includes(fundId + "") &&
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
                        return actionSplitted.includes(fundId + "") ? { ...permissionMap, allowed: !allChecked() } : permissionMap
                    }
                )
            })
        )
    }



    return (
        <Form.Check
            checked={allChecked()}
            label={fundName}
            onChange={() => togglePermissionWithThatType()}
            type="switch"
            id="custom-switch"
            disabled={disabled}
        />
    )

}

export default FundGrouper