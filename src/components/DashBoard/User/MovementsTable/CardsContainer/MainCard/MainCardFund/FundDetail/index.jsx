import React, { createRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from './Chart';

const FundDetail = ({ fundId, fund }) => {
    const chartContainer = createRef()
    const [Width, setWidth] = useState(0)
    const [Height, setHeight] = useState(0)

    useEffect(() => {
        const isNull = () => {
            return (chartContainer.current === null)
        }
        if (!isNull()) {
            setWidth(chartContainer.current.clientWidth)
            setHeight(chartContainer.current.clientHeight)
        }
    }, [chartContainer])


    return (
        <div ref={chartContainer} className={`mb-2 p-relative`}>
            <Chart Height={Height} Width={Width} fund={fund} />
        </div>
    )
}
export default FundDetail

