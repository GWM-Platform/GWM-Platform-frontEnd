import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';


const MovementsTab = ({ FixedDeposits }) => {

    return (
        <div className="p-0 h-100">
            <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                <div className={`movementsTable growAnimation`}>
                    {
                        FixedDeposits.fetching ?
                            <Loading movements="5"
                            />
                            :
                            FixedDeposits.content.total > 0 ?
                                <TableLastMovements
                                    content={FixedDeposits.content.deposits}
                                    movements=""
                                />
                                :
                                <NoMovements movements="5" />
                    }
                </div>

            </div>
        </div>
    )
}
export default MovementsTab

