import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import FundsTable from './FundsTable'
import FundsSearch from './FundsSearch'
import NoFunds from './NoFunds'

const ViewDeleteAndCreateFunds = ({Funds, SearchText, handleSearch, cancelSearch, AssetTypes, FilteredFunds, chargeFunds, setAction, Action }) => {

    return (
        <Col sm="12" md="10" className="ViewDeleteAndCreateFunds">
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