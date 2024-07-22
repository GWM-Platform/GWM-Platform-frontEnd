import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import FundsTable from './FundsTable'
import FundsSearch from './FundsSearch'
import NoFunds from './NoFunds'
import { useTranslation } from 'react-i18next';

const ViewDeleteAndCreateFunds = ({ Funds, SearchText, handleSearch, cancelSearch, AssetTypes, FilteredFunds, chargeFunds, setAction, Action }) => {
    const { t } = useTranslation()

    return (
        <Col sm="12" className="ViewDeleteAndCreateFunds">
            <div className="header-with-border">
                <h1 className="title">{t("Funds")}</h1>
            </div>
            {Funds.length > 0 ?
                <>
                    <FundsSearch
                        FilteredFunds={FilteredFunds} SearchText={SearchText} handleSearch={handleSearch} cancelSearch={cancelSearch} />
                    {
                        FilteredFunds.length === 0 && SearchText.length > 0 ?
                            <NoFunds motive={0} /> :
                            <FundsTable Funds={FilteredFunds} AssetTypes={AssetTypes} chargeFunds={chargeFunds} Action={Action} setAction={setAction} />
                    }
                </>
                :
                <NoFunds motive={0} />
            }

        </Col>
    )
}

export default ViewDeleteAndCreateFunds