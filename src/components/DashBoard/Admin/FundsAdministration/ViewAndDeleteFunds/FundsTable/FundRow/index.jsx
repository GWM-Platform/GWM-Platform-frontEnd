import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faEye } from '@fortawesome/free-regular-svg-icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { OverlayTrigger, Popover } from 'react-bootstrap';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const FundRow = ({ Fund, AssetTypes, chargeFunds, setAction, Action, ownKey }) => {

    const { t } = useTranslation();
    const [ShowModal, setShowModal] = useState(false)

    const launchDeleteConfirmation = () => {
        setShowModal(true)
    }

    const checkImage = async (url) => {
        const res = await fetch(url);
        const buff = await res.blob();
        return buff.type.startsWith('image/')
    }

    const hasCustomImage = () => Fund.imageUrl ? checkImage(Fund.imageUrl) : false

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header className="mt-0" as="h3">{t("Logo Preview")}</Popover.Header>
            <Popover.Body className="d-flex justify-content-center">
                <div className="fundLogo">
                    <div className="border">
                        <img className="logo" alt="" src={hasCustomImage() ? Fund.imageUrl : process.env.PUBLIC_URL + '/images/FundsLogos/default.svg'} />
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <>
            <tr className="fundRow">
                <td className="Name">{Fund.name}</td>
                <td className="Type">{AssetTypes[getAssetTypeById(AssetTypes, Fund.typeId)].name}</td>
                <td className="Shares">
                    <FormattedNumber value={Fund.shares} prefix="" fixedDecimals={2} />
                </td>
                <td className="FreeShares">
                    <FormattedNumber value={Fund.freeShares} prefix="" fixedDecimals={2} />
                </td>
                <td className="SharePrice">
                    <FormattedNumber value={Fund.sharePrice} prefix="$" fixedDecimals={2} />
                </td>
                <td className="Id">{t(Fund.spreadsheetId)}</td>
                <td className="Actions verticalCenter" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <button className="noStyle iconContainer red" onClick={() => { launchDeleteConfirmation() }}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                        </button>
                        <button className="noStyle iconContainer  green" onClick={() => setAction({ ...Action, ...{ action: 0, fund: ownKey } })}>
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                        </button>
                        <OverlayTrigger delay={{ show: "200", hide: 0 }} placement="left" overlay={popover}>
                            <button className="noStyle iconContainer  green">
                                <FontAwesomeIcon className="icon" icon={faEye} />
                            </button>
                        </OverlayTrigger>
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

