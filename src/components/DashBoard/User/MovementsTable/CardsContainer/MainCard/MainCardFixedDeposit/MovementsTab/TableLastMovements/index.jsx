import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import FixedDepositListItem from './FixedDeposit';

const TableLastMovements = ({ content, movements, selectedFixedDepositId }) => {


    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements w-1 overflow-auto `}>
            {content.map((FixedDepositData, key) =>
                <FixedDepositListItem content={FixedDepositData} key={key} selectedFixedDepositId={selectedFixedDepositId} />
            )}

        </div>

    )
}
export default TableLastMovements
