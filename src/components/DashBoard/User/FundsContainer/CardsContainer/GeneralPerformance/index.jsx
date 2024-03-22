import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent'
import React, { useState } from 'react'

const GeneralPerformance = ({ value, setValue }) => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className={`general-performance-wrapper ${collapsed ? "collapsed" : ""}`}>
            <div className='general-performance'>
                <PerformanceComponent valueExternal={value} setValueExternal={setValue} text={"Total performance"} />
            </div>
            <button className='collapser-button' onClick={() => setCollapsed(prevState => !prevState)}>
                <FontAwesomeIcon icon={faChevronUp} />
            </button>
        </div>
    )
}

export default GeneralPerformance