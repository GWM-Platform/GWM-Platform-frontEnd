import React, { useCallback, useMemo, useContext, Fragment } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Accordion, Badge, Button, Col, Container, Form, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { DashBoardContext } from 'context/DashBoardContext'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'

const User = ({ user, permissions, funds, getUsers }) => {

    const { ClientSelected, toLogin, DashboardToastDispatch, hasPermission } = useContext(DashBoardContext);
    const { t } = useTranslation()

    const [PermissionEdit, setPermissionEdit] = useState({
        fetching: false,
        editionEnabled: false
    })

    const [AssignOwner, setAssignOwner] = useState({
        fetching: false
    })

    const [DisconnectUser, setDisconnectUser] = useState({
        fetching: false
    })

    const [DoubleCheck, setDoubleCheck] = useState({
        fetching: false
    })

    const toggleEdition = () => setPermissionEdit(prevState => ({ ...prevState, editionEnabled: !prevState.editionEnabled }))

    const isOwner = useCallback(
        () => user?.permissions?.filter(permission => permission?.action === "OWNER")?.length > 0
        ,
        [user],
    )

    const userHasPermission = useCallback(
        (permissionId = -1) => user.permissions.filter(permission => permission.id === permissionId)?.length > 0 || isOwner()
        ,
        [user, isOwner],
    )

    const initialState = useMemo(() => {
        return {
            permissions:
                permissions.map((permission) => ({
                    id: permission.id,
                    action: permission.action,
                    allowed: userHasPermission(permission.id)
                }))
        }

    }, [permissions, userHasPermission])

    const [FormData, setFormData] = useState(initialState)
    const resetFormData = () => {
        toggleEdition()
        setFormData({ ...initialState })
    }

    const isSpecificFundPermission = (permission) =>
        permission.action.includes("FUND")

    const isStakePermission = (permission) =>
        permission.action.includes("STAKE")

    const StakeOrFundPermission = (permission) => isSpecificFundPermission(permission) || isStakePermission(permission)

    const notifyNewUser = () => user.permissions.length === 0

    const setPermissions = () => {
        setPermissionEdit(() => (
            {
                fetching: true,
                editionEnabled: false
            }))
        axios.post(`/permissions/client/${ClientSelected.id}`, {
            permissions: FormData.permissions.filter(permission => permission.allowed).map(permission => permission.id)
        }, {
            params: {
                userId: user.userId
            }
        }).then(function () {
            getUsers()
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Permissions edited succesfully" } });
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setPermissionEdit(() => (
                    {
                        fetching: false,
                        editionEnabled: false
                    }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error editing the permissions" } });
            }

        });
    }

    const disconnectUser = () => {
        setDisconnectUser(() => (
            {
                fetching: true,
            }))
        axios.delete(`/clients/${ClientSelected.id}/clientDisconnect`, {
            params: {
                userId: user.userId
            }
        }).then(function () {
            getUsers()
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "User disconnected successfully" } });
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setDisconnectUser(() => (
                    {
                        fetching: false,
                    }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error disconnecting the user" } });
            }

        });
    }

    const assignOwner = () => {
        setAssignOwner(() => (
            {
                fetching: true,
            }))
        axios.post(`/clients/${ClientSelected.id}/assignOwner`, {}, {
            params: {
                userId: user.userId
            }
        }).then(function () {
            getUsers()
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "User assigned as owner successfully" } });
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setAssignOwner(() => (
                    {
                        fetching: false,
                    }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error assigning the user as owner" } });
            }

        });
    }


    const toggleDoubleCheck = () => {

        setDoubleCheck(() => (
            {
                fetching: true,
            }))

        axios.post(
            `/clients/${ClientSelected.id}/${user?.doubleCheck ? "disableDoubleCheck" : "enableDoubleCheck"}`, {}, {
            params: {
                userId: user.userId
            }
        }).then(function () {
            getUsers()
            user?.doubleCheck ?
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "\"Require signature\" deactivated successfully" } })
                :
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "\"Require signature\" activated successfully" } })
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setAssignOwner(() => (
                    {
                        fetching: false,
                    }))
                user?.doubleCheck ?
                    DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error deactivating \"Require signature\"" } })
                    :
                    DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error activating \"Require signature\"" } })
            }
        });
    }

    return (
        <Accordion.Item className="user" eventKey={user.id}>
            <Accordion.Header>
                <div className="mb-0 pe-1 pe-md-2" >
                    <h1 className="title d-flex align-items-center">{t("User")}&nbsp;#{user.id}
                        {
                            notifyNewUser() &&
                            <>
                                &nbsp;
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id={`tooltip-notice-${user.id}`}>
                                            {t("Permissions have not yet been set for this user")}
                                        </Tooltip>
                                    }
                                >
                                    <div>
                                        <FontAwesomeIcon icon={faExclamationTriangle} />
                                    </div>
                                </OverlayTrigger>
                            </>
                        }
                        {
                            !!(user.isOwner) &&
                            <>
                                &nbsp;
                                <Badge bg="primary">
                                    {t("Client owner")}
                                </Badge>
                            </>
                        }
                        {
                            !!(user.doubleCheck) &&
                            <>
                                &nbsp;
                                <Badge bg="secondary">
                                    {t("Signature required")}&nbsp;
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id={`tooltip-notice-${user.id}`}>
                                                {t("Tickets generated by this user require owner approval in the history section")}
                                            </Tooltip>
                                        }
                                    >
                                        <span>
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                        </span>
                                    </OverlayTrigger>
                                </Badge>
                            </>
                        }
                    </h1>
                    <h2 className="email">
                        {t("Email")}:&nbsp;
                        {user.email}
                    </h2>
                </div>
                <div className="ms-auto">
                </div>
            </Accordion.Header>
            <Accordion.Body>
                <Container className="px-0" fluid>
                    <Form>
                        <Row className='pt-2'>
                            <Col xs="12">
                                <h3 className="permission-category ">{t("Funds permissions")}:</h3>
                            </Col>
                            <Col xs="3">{t("All")}</Col>
                            <Col xs="3">
                                <PermissionGrouper permissions={FormData.permissions} type="VIEW" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                            </Col>
                            <Col xs="3">
                                <PermissionGrouper permissions={FormData.permissions} type="BUY" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                            </Col>
                            <Col xs="3">
                                <PermissionGrouper permissions={FormData.permissions} type="SELL" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                            </Col>
                            {
                                funds.map(
                                    fund =>
                                        <Fragment key={"Funds-permission-group-" + fund.id}>
                                            <Col xs="3">
                                                <FundGrouper
                                                    fundId={fund.id} fundName={fund.name} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} setFormData={setFormData} disabled={!PermissionEdit.editionEnabled}
                                                />
                                            </Col>
                                            <Col xs="3">
                                                <FundPermission funds={funds} FormData={FormData} fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="VIEW" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </Col>
                                            <Col xs="3">
                                                <FundPermission funds={funds} FormData={FormData} fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="BUY" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </Col>
                                            <Col xs="3">
                                                <FundPermission funds={funds} FormData={FormData} fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="SELL" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </Col>
                                        </Fragment>
                                )
                            }


                            <Col xs="12">
                                <h3 className="permission-category mt-2 pt-2 border-top">{t("Other permissions")}:</h3>
                            </Col >
                            {
                                FormData.permissions
                                    .filter(permission => permission.action !== "OWNER" &&
                                        permission.action !== "VIEW_ALL_FUNDS" &&
                                        permission.action !== "BUY_ALL_FUNDS" &&
                                        permission.action !== "SELL_ALL_FUNDS" &&
                                        permission.action !== "CLIENT_DOUBLECHECK" &&
                                        (!StakeOrFundPermission(permission)))
                                    .map(
                                        (permission) =>
                                            <Permission
                                                user={user} permission={permission} funds={funds} FormData={FormData}
                                                setFormData={setFormData} disabled={!PermissionEdit.editionEnabled}
                                                key={`user-${user.id}-permission-${permission.id}`} />
                                    )
                            }
                            {
                                hasPermission('') &&
                                <Col xs="12">
                                    <div className="permission-category mt-2 pt-2 border-top" />
                                </Col >
                            }
                        </Row>
                    </Form>
                    <Row className="justify-content-end gx-2">
                        {
                            PermissionEdit.editionEnabled || PermissionEdit.fetching ?
                                <>
                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" disabled={PermissionEdit.fetching} onClick={() => resetFormData()}>
                                            {t("Cancel")}
                                        </Button>
                                    </Col>
                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" disabled={PermissionEdit.fetching} onClick={() => setPermissions()}>
                                            {
                                                PermissionEdit.fetching &&
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='me-2' />
                                            }
                                            {t("Confirm")}

                                        </Button>
                                    </Col>
                                </>
                                :
                                <>
                                    {/*The owners only can make another user owner */}
                                    {
                                        !(!hasPermission('')) &&

                                        <Col xs="auto" className=" mb-2">
                                            <Button disabled={DoubleCheck.fetching} variant="danger" onClick={toggleDoubleCheck}>
                                                {
                                                    DoubleCheck.fetching &&
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='me-2' />
                                                }
                                                {user.doubleCheck ?
                                                    t("Don't require signature")
                                                    :
                                                    t('Require signature')
                                                }
                                            </Button>
                                        </Col>
                                    }
                                    {
                                        !(!hasPermission('') || user?.isOwner) &&

                                        <Col xs="auto" className=" mb-2">
                                            <Button disabled={AssignOwner.fetching} variant="danger" onClick={assignOwner}>
                                                {
                                                    AssignOwner.fetching &&
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='me-2' />
                                                }
                                                {t('Make owner')}
                                            </Button>
                                        </Col>
                                    }
                                    {
                                        !(!hasPermission('REMOVE_USERS') || user?.isOwner) &&
                                        <Col xs="auto" className=" mb-2">
                                            <Button disabled={DisconnectUser.fetching} variant="danger" onClick={disconnectUser}>
                                                {
                                                    DisconnectUser.fetching &&
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='me-2' />
                                                }
                                                {t("Disconnect")}
                                            </Button>
                                        </Col>
                                    }
                                    {
                                        !(!hasPermission('MODIFY_PERMISSIONS') || user?.isOwner) &&
                                        <Col xs="auto" className=" mb-2">
                                            <Button variant="danger" onClick={() => toggleEdition()}>
                                                {t("Edit permissions")}
                                            </Button>
                                        </Col>
                                    }
                                </>
                        }
                    </Row>
                </Container>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default User

const Permission = ({ FormData, setFormData, permission, funds, disabled }) => {
    const { t } = useTranslation()

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
                    [`BUY_STAKES_${fund.id}`]: ["VIEW_ACCOUNT"],
                }
            ), {}),
    }

    const unsatisfiedDependencies = () => {
        const permissionDependencies = permissionsDependencies[permission?.action] || []
        return permissionDependencies?.filter(dependency => !(FormData?.permissions?.find(permissionFind => permissionFind?.action === dependency)?.allowed))
    }

    const hasUnsatisfiedDependencies = () => unsatisfiedDependencies().length > 0

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
        <Col md="4" >
            <Form.Check
                checked={permission.allowed}
                onChange={() => togglePermission()}
                type="switch"
                className="d-inline-block"
                id="custom-switch"
                label={composeTraduction(permission?.action)}
                disabled={disabled}
            />
            {
                !!(hasUnsatisfiedDependencies() && permission?.allowed) &&
                <>
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
                        <div className='d-inline-block'>
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                    </OverlayTrigger>
                </>
            }
        </Col >
    )
}

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
            {
                !!(hasUnsatisfiedDependencies() && permission?.allowed) &&
                <>
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
                        <div className='d-inline-block'>
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                    </OverlayTrigger>
                </>
            }
        </>
    )

}

const PermissionGrouper = ({ permissions, type, setFormData, disabled }) => {
    const { t } = useTranslation()

    const allChecked = () =>
        permissions.filter(
            permission =>
                permission.action.split('_').includes(type) &&
                (permission.action.split('_').includes("FUND") || permission.action.split('_').includes("STAKE") || permission.action.split('_').includes("STAKES"))
        ).length ===
        permissions.filter(
            permission =>
                permission.action.split('_').includes(type) &&
                (permission.action.split('_').includes("FUND") || permission.action.split('_').includes("STAKE") || permission.action.split('_').includes("STAKES")) &&
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
                            (actionSplitted.includes("FUND") || actionSplitted.includes("STAKE") || actionSplitted.includes("STAKES"))
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