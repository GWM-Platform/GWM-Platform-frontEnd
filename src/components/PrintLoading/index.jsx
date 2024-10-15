import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import './index.scss'
import { isHtmlPrintActive } from "Slices/DashboardUtilities/PrintHtmlSlice";
const PrintLoading = () => {
    const active = useSelector(isHtmlPrintActive)
    
    return (
        <div className={`PrintLoading ${active  ? "active" : ""}`}>
            <FontAwesomeIcon className="print-icon" style={{ color: "black", fontSize: "10rem" }} icon={faPrint} />
        </div>
    )
}

export default PrintLoading