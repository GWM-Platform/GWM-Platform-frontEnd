import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import FixedDeposit from './FixedDeposit';

const TableLastMovements = ({ content, movements }) => {

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements w-1 overflow-auto `}>
            {content.map((FixedDepositData, key) =>
                <FixedDeposit content={FixedDepositData} key={key} />
            )}

        </div>

    )
}
export default TableLastMovements
