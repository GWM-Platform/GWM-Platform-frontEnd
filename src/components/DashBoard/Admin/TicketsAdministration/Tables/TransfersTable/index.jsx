import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Col } from 'react-bootstrap'
import TransferRow from './TransferRow'

const TransfersTable = ({ AccountInfo, UsersInfo, movements, state, reloadData, take }) => {

    const anyWithActions = () => Object.values(movements).some((field) => field.stateId === 1)

    return (
        <Col xs="12" className="mt-2">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )`, scrollSnapType: "both mandatory" }}>
                {
                    movements.map((movement, key) =>
                        <TransferRow key={key} Movement={movement} reloadData={reloadData} anyWithActions={anyWithActions()} />
                    )
                }
            </div>
        </Col>
    )
}
export default TransfersTable


