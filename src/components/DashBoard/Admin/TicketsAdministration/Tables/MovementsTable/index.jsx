import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Col } from 'react-bootstrap'
import MovementRow from './MovementRow'

const MovementsTable = ({ AccountInfo, UsersInfo, movements, state, reloadData, take }) => {

    const couldLiquidate = (movement) => movement.motive === "WITHDRAWAL" && movement.stateId === 2
    const anyWithActions = () => Object.values(movements).some((movement) => movement.stateId === 1 || couldLiquidate(movement))
    
    return (
        <Col xs="12" className="mt-2">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )` }}>
                {
                    movements.map((movement, key) =>
                        <MovementRow AccountInfo={AccountInfo} UsersInfo={UsersInfo} couldLiquidate={couldLiquidate}
                            reloadData={reloadData} key={key} Movement={movement} state={state} anyWithActions={anyWithActions()} />
                    )
                }

            </div>
        </Col>
    )
}
export default MovementsTable


