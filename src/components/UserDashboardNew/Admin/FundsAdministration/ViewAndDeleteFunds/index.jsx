import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import FundsTable from './FundsTable'
import FundsSearch from './FundsSearch'
import NoFunds from './NoFunds'

const ViewDeleteAndCreateFunds = ({ SearchText,handleSearch,cancelSearch,AssetTypes,FilteredFunds, chargeFunds,setAction,Action}) => {

    return (
        <Col sm="12" md="10" className="ViewDeleteAndCreateFunds">
            <FundsSearch FilteredFunds={FilteredFunds} SearchText={SearchText} handleSearch={handleSearch} cancelSearch={cancelSearch} />
            {
                FilteredFunds.length === 0 && SearchText.length>0 ?
                    <NoFunds /> :
                    <FundsTable Funds={FilteredFunds} AssetTypes={AssetTypes} chargeFunds={chargeFunds} Action={Action} setAction={setAction}/>
            }
        </Col>
    )
}

export default ViewDeleteAndCreateFunds