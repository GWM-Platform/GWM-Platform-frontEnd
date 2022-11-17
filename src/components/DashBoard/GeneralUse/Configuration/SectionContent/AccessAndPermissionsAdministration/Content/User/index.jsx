import React, { useCallback, useMemo, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Accordion, Badge, Button, Col, Container, Form, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
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
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error while editing the permissions" } });
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
                                        <>
                                            <Col xs="3">
                                                <FundGrouper
                                                    fundId={fund.id} fundName={fund.name} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} setFormData={setFormData} disabled={!PermissionEdit.editionEnabled}
                                                />
                                            </Col>
                                            <Col xs="3">
                                                <FundPermission fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="VIEW" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </Col>
                                            <Col xs="3">
                                                <FundPermission fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="BUY" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </Col>
                                            <Col xs="3">
                                                <FundPermission fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="SELL" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </Col>
                                        </>
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
                                        (!StakeOrFundPermission(permission)))
                                    .map(
                                        (permission, index) =>
                                            <Permission
                                                user={user} permission={permission} funds={funds}
                                                setFormData={setFormData} disabled={!PermissionEdit.editionEnabled}
                                                key={`user-${user.id}-permission-${permission.id}`} />
                                    )
                            }
                            <Col xs="12">
                                <div className="permission-category mt-2 pt-2 border-top" />
                            </Col >
                        </Row>
                    </Form>
                    <Row className="justify-content-end gx-2">
                        {
                            PermissionEdit.editionEnabled || PermissionEdit.fetching ?
                                <>
                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" disabled={PermissionEdit.fetching} onClick={() => resetFormData()}>
                                            {t("Cancelar")}
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
                                    <Col xs="auto" className=" mb-2">
                                        <Button disabled={!hasPermission('')} variant="danger">
                                            {t('Make owner')}
                                        </Button>
                                    </Col>

                                    <Col xs="auto" className=" mb-2">
                                        <Button disabled={!hasPermission('REMOVE_USERS')} variant="danger">
                                            {t("Disconnect")}
                                        </Button>
                                    </Col>

                                    <Col xs="auto" className=" mb-2">
                                        <Button variant="danger" disabled={!hasPermission('MODIFY_PERMISSIONS')} onClick={() => toggleEdition()}>
                                            {t("Edit permissions")}
                                        </Button>
                                    </Col>

                                </>
                        }
                    </Row>
                </Container>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default User

const Permission = ({ setFormData, permission, funds, disabled }) => {
    const { t } = useTranslation()

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

    const isSpecificFundPermission = () =>
        permission.action.includes("FUND") && permission.action !== "VIEW_ALL_FUNDS"

    const isStakePermission = () =>
        permission.action.includes("STAKE")

    const isSellPermission = () =>
        permission.action.includes("SELL")

    const isBuyPermission = () =>
        permission.action.includes("BUY")

    const getFundName = () => {
        const fundId = permission.action.slice(-1)
        if (!isNaN(+fundId)) {
            return funds?.find(fund => fund?.id === +fundId)?.name || t("Not found")
        } else {
            return t("Not found")
        }
    }

    const composeTraduction = () => {
        if (isSpecificFundPermission()) {
            return (t("VIEW_FUND", { fundName: getFundName() }))
        } else if (isStakePermission()) {
            if (isBuyPermission()) {
                return (t("BUY_STAKES", { fundName: getFundName() }))
            } else if (isSellPermission()) {
                return (t("SELL_STAKES", { fundName: getFundName() }))
            } else {
                return (t("Unknown permission"))
            }
        } else {
            return (permission.action === "FIXED_DEPOSIT_CREATE" || permission.action === "DEPOSIT" ?
                t(`PERMISSION_${permission.action}`)
                :
                t(permission?.action))
        }
    }

    return (
        <Col md="4" >
            <Form.Check
                checked={permission.allowed}
                onChange={() => togglePermission()}
                type="switch"
                id="custom-switch"
                label={composeTraduction()}
                disabled={disabled}
            />
        </Col >
    )
}

const FundPermission = ({ fundId, permissions, type, setFormData, disabled }) => {
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

    return (
        <Form.Check
            checked={permission.allowed}
            onChange={() => togglePermission()}
            type="switch"
            id="custom-switch"
            label={t(type)}
            disabled={disabled}
        />
    )

}

const PermissionGrouper = ({ permissions, type, setFormData, disabled }) => {
    const { t } = useTranslation()

    const allChecked = () =>
        permissions.filter(
            permission =>
                permission.action.split('_').includes(type)
        ).length ===
        permissions.filter(
            permission =>
                permission.action.split('_').includes(type) &&
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
                        return actionSplitted.includes(type) ? { ...permissionMap, allowed: !allChecked() } : permissionMap
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