import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'

import FixedDepositRow from './FixedDepositRow'

const FixedDepositsTable = ({ AccountInfo, UsersInfo, movements, state, reloadData, take }) => {

    //===1 pending, the admin could approve or deny, ===2 approved,if it isn't already the admin could close it


    return (

        <Col xs="12" className="mt-2">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )`, scrollSnapType: "both mandatory" }}>
                {
                    movements.map((movement, key) =>
                        <FixedDepositRow AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                            reloadData={reloadData} key={key} Movement={movement} state={state} />
                    )
                }
            </div>
        </Col>
    )
}
export default FixedDepositsTable


