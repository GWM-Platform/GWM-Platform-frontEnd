import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const AssetRow = ({ Asset, AssetTypes, chargeAssets, setAction, Action, ownKey }) => {

    const [ShowModal, setShowModal] = useState(false)

    // eslint-disable-next-line
    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }
    return (
        <>
            <tr className="AssetRow">
                <td className="Name">{Asset.name}</td>
                <td className="Type">{AssetTypes[getAssetTypeById(AssetTypes, Asset.typeId)].name}</td>
                <td className="SharePrice">{Asset.symbol}</td>
                <td className="SharePrice">
                    <FormattedNumber value={Asset.value} prefix="U$D " fixedDecimals={2} />
                </td>
                <td className="Id">{Asset.id}</td>

                <td className="Actions verticalCenter" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        {/*<div className="iconContainer red" onClick={() => { launchDeleteConfirmation() }}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </div>*/}
                        <button className="noStyle iconContainer green" onClick={() => setAction({ ...Action, ...{ action: 0, Asset: ownKey } })}>
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </button>
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

