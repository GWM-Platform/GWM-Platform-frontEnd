import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEdit } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'

const AssetRow = ({ Asset, AssetTypes, chargeAssets, setAction, Action, ownKey }) => {

    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)
    
    // eslint-disable-next-line
    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }
    return (
        <>
            <tr className="AssetRow">
                <td className="Id">{t(Asset.id)}</td>
                <td className="Name">{t(Asset.name)}</td>
                <td className="Type">{t(AssetTypes[getAssetTypeById(AssetTypes, Asset.typeId)].name)}</td>
                <td className="SharePrice">{t(Asset.symbol)}</td>
                <td className="SharePrice">${t(Asset.value)}</td>

                <td className="Actions verticalCenter" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        {/*<div className="iconContainer red" onClick={() => { launchDeleteConfirmation() }}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </div>*/}
                        <div className="iconContainer green" onClick={() => setAction({ ...Action, ...{ action: 0, Asset: ownKey } })}>
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </div>
                    </div>
                </td>
            </tr>
            <DeleteConfirmationModal show={ShowModal} setShowModal={setShowModal} Asset={Asset} chargeAssets={chargeAssets} />
        </>
    )
}
export default AssetRow


const getAssetTypeById = (assetTypes, id) =>
    assetTypes.findIndex((AssetType) => AssetType.id === id)

