import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useTranslation } from 'react-i18next'
import { Col } from 'react-bootstrap'
import PermissionGrouper from './PermissionGrouper'
import FundGrouper from './FundGrouper'
import FundPermission from './FundPermission'

const FundsPermissions = ({ funds, FormData, setFormData, PermissionEdit }) => {
    const { t } = useTranslation()

    return (
        <>
            <Col xs="12">
                <h3 className="permission-category mt-2 pt-2 border-top mb-0">{t("Funds permissions")}:</h3>
            </Col>
            <Col xs="12">
                <div className='w-100 overflow-auto'>
                    <table className='w-100 mb-2'>
                        <thead>
                            <tr>
                                <th style={{ fontWeight: 400 }}>
                                    {t("All")}
                                </th>
                                <th className="px-2" style={{ fontWeight: 400 }}>
                                    <PermissionGrouper permissions={FormData.permissions} type="VIEW" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                </th>
                                <th className="px-2" style={{ fontWeight: 400 }}>
                                    <PermissionGrouper permissions={FormData.permissions} type="BUY" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                </th>
                                <th className="px-2" style={{ fontWeight: 400 }}>
                                    <PermissionGrouper permissions={FormData.permissions} type="SELL" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                </th>
                                <th className="px-2" style={{ fontWeight: 400 }}>
                                    <PermissionGrouper permissions={FormData.permissions} type="TRANSFER" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                funds.map(
                                    fund =>
                                        <tr key={"Funds-permission-group-" + fund.id}>
                                            <td style={{ verticalAlign: "top" }}>
                                                <FundGrouper fundId={fund.id} fundName={fund.name} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </td>
                                            <td className='px-2' style={{ verticalAlign: "top" }}>
                                                <FundPermission funds={funds} FormData={FormData} fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="VIEW" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </td>
                                            <td className='px-2' style={{ verticalAlign: "top" }}>
                                                <FundPermission funds={funds} FormData={FormData} fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="BUY" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </td>
                                            <td className='px-2' style={{ verticalAlign: "top" }}>
                                                <FundPermission funds={funds} FormData={FormData} fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="SELL" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </td>
                                            <td className='px-2' style={{ verticalAlign: "top" }}>
                                                <FundPermission funds={funds} FormData={FormData} fundId={fund.id} permissions={FormData.permissions.filter(permission => permission.action !== "VIEW_ACCOUNT")} type="TRANSFER" setFormData={setFormData} disabled={!PermissionEdit.editionEnabled} />
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>

            </Col>
        </>
    );
}

export default FundsPermissions





