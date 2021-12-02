import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'

const FundRow = ({ Fund, AssetTypes,chargeFunds }) => {

    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)

    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <tr className="fundRow">
                <td>{t(Fund.id)}</td>
                <td>{t(Fund.name)}</td>
                <td>{t(AssetTypes[getAssetTypeById(AssetTypes, Fund.typeId)].name)}</td>
                <td>{t(Fund.shares)}</td>
                <td>{t(Fund.freeShares)}</td>
                <td>{t(Fund.sharePrice)}</td>

                <td className="verticalCenter" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <div className="iconContainer red" onClick={() => { launchDeleteConfirmation() }}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </div>
                        <div className="iconContainer green">
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </div>
                    </div>
                </td>
            </tr>
            <DeleteConfirmationModal show={ShowModal} handleClose={handleCloseModal} Fund={Fund} chargeFunds={chargeFunds} />
        </>
    )
}
export default FundRow


const getAssetTypeById = (assetTypes, id) => 
    assetTypes.findIndex((AssetType) => AssetType.id === id)

