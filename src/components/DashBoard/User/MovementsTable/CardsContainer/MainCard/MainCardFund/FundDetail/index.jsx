import React, { createRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from './Chart';

const FundDetail = ({ fund, maxHeight, margin }) => {
    const chartContainer = createRef()

    return (
        <div ref={chartContainer} className="mb-2 p-relative h-100" style={{ minHeight: "400px", maxHeight }}>
            <Chart fund={fund} margin={margin} />
        </div>
    )
}
export default FundDetail

