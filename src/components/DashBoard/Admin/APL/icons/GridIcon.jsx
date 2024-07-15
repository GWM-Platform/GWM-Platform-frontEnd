import * as React from "react";

const GridIcon = ({ active, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 14" // Ajusta estos valores según el tamaño original de tu gráfico
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        {...props}
    >
        <path
            fill={active ? "#FFF" : "#082044"}
            fillRule="evenodd"
            d="M0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1Zm2 1h2v2H2V2ZM0 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V9Zm2 1h2v2H2v-2ZM9 0a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H9Zm3 2h-2v2h2V2ZM8 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9Zm2 1h2v2h-2v-2Z"
            clipRule="evenodd"
        />
    </svg>
);

export default GridIcon;