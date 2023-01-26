import React from "react";
import './index.scss'

const MoreButton = React.forwardRef(({ children, onClick,title }, ref) =>
    <button
    title={title}
        type="button"
        href="" ref={ref} className="moreButton btn no-style visibleOnlyOnHover px-2"
        onClick={(e) => { e.preventDefault(); onClick(e); }} >
        <img alt="more" src={`${process.env.PUBLIC_URL}/images/generalUse/more.svg`} />
    </button>
)

export default MoreButton