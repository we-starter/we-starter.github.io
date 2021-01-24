import React from "react";

export const GLFIcon = ({ width = 70, height = 70 }) => (
    <svg className="statistics__logo" width={width} height={height} viewBox="0 0 70 70">
        <circle cx="35" cy="34.5" r="34.5" fill="#1D1D1D"></circle>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M52.5 25.33V24h-4.18c-1.87 0-3.6.92-4.65 2.46l-4.96 7.37h-9.55v1.34h8.66l-4.47 6.63a4.24 4.24 0 01-3.52 1.87H28.1a9.22 9.22 0 01-9.25-9.17 9.22 9.22 0 019.25-9.17h10.91V24h-10.9c-5.85 0-10.61 4.71-10.61 10.5S22.26 45 28.1 45h1.73c1.87 0 3.6-.92 4.64-2.46l4.96-7.37h9.02v-1.34h-8.12l4.46-6.63a4.24 4.24 0 013.53-1.87h4.18z"
            fill="#fff"
            stroke="#fff"
        ></path>
    </svg>
);
