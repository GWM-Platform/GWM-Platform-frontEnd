import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEdit } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'

const FundRow = ({ Fund, AssetTypes, chargeFunds, setAction, Action, ownKey }) => {

    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)
    
    // eslint-disable-next-line
    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }

    return (
        <>
            <tr className="fundRow">
                <td className="Id">{t(Fund.id)}</td>
                <td className="Name">{t(Fund.name)}</td>
                <td className="Type">{t(AssetTypes[getAssetTypeById(AssetTypes, Fund.typeId)].name)}</td>
                <td className="Shares">{t(Fund.shares)}</td>
                <td className="FreeShares">{t(Fund.freeShares)}</td>
                <td className="SharePrice">{t(Fund.sharePrice)}</td>

                <td className="Actions verticalCenter" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        {/*<div className="iconContainer red" onClick={() => { launchDeleteConfirmation() }}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </div>*/}
                        <div className="iconContainer green" onClick={() => setAction({ ...Action, ...{ action: 0, fund: ownKey } })}>
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </div>
                    </div>
                </td>
            </tr>
            <DeleteConfirmationModal show={ShowModal} setShowModal={setShowModal} Fund={Fund} chargeFunds={chargeFunds} />
        </>
    )
}
export default FundRow


const getAssetTypeById = (assetTypes, id) =>
    assetTypes.findIndex((AssetType) => AssetType.id === id)

