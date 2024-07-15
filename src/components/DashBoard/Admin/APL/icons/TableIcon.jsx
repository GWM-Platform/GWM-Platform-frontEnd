import * as React from "react";

const TableIcon = ({ active, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 12" // Ajusta estos valores según el tamaño original de tu gráfico
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        {...props}
    >
        <path
            fill={active ? "#FFF" : "#082044"}
            fillRule="evenodd"
            d="M1 0a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H1ZM0 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm1 4a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H1Z"
            clipRule="evenodd"
        />
    </svg>
);

export default TableIcon;